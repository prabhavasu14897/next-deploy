"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { ContentTone, ContentTypeId, PlatformDraft, Post, RewriteAction, TabStatus } from "./types";
import * as api from "./api-client";
import type { ApiError } from "./api-client";
import { breakLongFirstParagraph, defaultBenefitSentence, defaultCtaFor, scorePost } from "./optimization";
import { makeId } from "../organizations/id";
import { usePlatforms } from "../platforms/store";

const STORAGE_KEY = "ascentware.smp.posts.v2";

interface State {
  posts: Post[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Omit<State, "hydrated"> | null }
  | { type: "add_post"; post: Post }
  | { type: "update_draft"; postId: string; platformId: string; updates: Partial<PlatformDraft> }
  | { type: "delete_post"; id: string };

const initialState: State = { posts: [], hydrated: false };

// A page reload has no live timer to resolve an in-flight generation/post,
// and a "scheduled" draft's timer needs re-arming (see PostsProvider) —
// reset transient statuses to something the UI can act on again.
function sanitizePosts(posts: Post[]): Post[] {
  return posts.map((post) => ({
    ...post,
    drafts: post.drafts.map((draft) =>
      draft.status === "generating" || draft.status === "posting"
        ? { ...draft, status: "failed" as TabStatus, error: "Interrupted by a page reload." }
        : draft
    ),
  }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state ? { posts: sanitizePosts(action.state.posts), hydrated: true } : { ...state, hydrated: true };
    case "add_post":
      return { ...state, posts: [action.post, ...state.posts] };
    case "update_draft":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                drafts: post.drafts.map((draft) =>
                  draft.platformId === action.platformId ? { ...draft, ...action.updates } : draft
                ),
              }
            : post
        ),
      };
    case "delete_post":
      return { ...state, posts: state.posts.filter((post) => post.id !== action.id) };
    default:
      return state;
  }
}

function status(value: TabStatus, error: string | null = null): Pick<PlatformDraft, "status" | "error"> {
  return { status: value, error };
}

function apiErrorMessage(err: unknown): string {
  return (err as ApiError)?.message ?? "Something went wrong.";
}

function buildImagePrompt(prompt: string, imageStyles: string[]): string {
  return imageStyles.length > 0 ? `${prompt}\n\nVisual style: ${imageStyles.join(", ")}.` : prompt;
}

interface PostsContextValue {
  state: State;
  createDraft: (
    organizationId: string,
    contentType: ContentTypeId,
    prompt: string,
    imageStyles: string[],
    targets: { platformId: string; accountId: string | null }[],
    tone?: ContentTone
  ) => string;
  regenerateImage: (postId: string, platformId: string, correction?: string) => void;
  generateHashtagsFor: (postId: string, platformId: string) => Promise<void>;
  applyRewrite: (postId: string, platformId: string, action: RewriteAction) => Promise<void>;
  applyAllSuggestions: (postId: string, platformId: string) => Promise<void>;
  updateDraftText: (
    postId: string,
    platformId: string,
    updates: Partial<Pick<PlatformDraft, "caption" | "hashtags" | "tone" | "imageStyles">>
  ) => void;
  saveAsDraft: (postId: string) => void;
  scheduleDraft: (postId: string, platformId: string, whenIso: string) => void;
  submitPost: (postId: string) => void;
  deletePost: (id: string) => void;
  postsForOrg: (organizationId: string) => Post[];
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { platformById } = usePlatforms();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", state: raw ? JSON.parse(raw) : null });
    } catch {
      dispatch({ type: "hydrate", state: null });
    }
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts: state.posts }));
    } catch {
      // storage unavailable (private mode, quota) — state still works in-memory
    }
  }, [state]);

  // Publishes one draft for real, via the generic /publish/:platformKey
  // route — shared by the immediate-publish path and the scheduled-timer
  // path so both go through identical logic.
  const publishDraft = useCallback(
    (postId: string, platformId: string, imageBase64: string, caption: string) => {
      const platform = platformById(platformId);
      if (!platform) return;
      const platformKey = platform.name.trim().toLowerCase();

      dispatch({ type: "update_draft", postId, platformId, updates: status("posting") });
      api
        .publish(platformKey, { imageBase64, caption })
        .then((result) => {
          dispatch({
            type: "update_draft",
            postId,
            platformId,
            updates: { externalPostId: result.externalPostId, scheduledFor: null, ...status("posted") },
          });
        })
        .catch((err) => {
          dispatch({ type: "update_draft", postId, platformId, updates: status("failed", apiErrorMessage(err)) });
        });
    },
    [platformById]
  );

  // Re-arm any "scheduled" draft's timer on load — a reload has no live
  // timer, but the schedule itself is real and should still fire once the
  // tab is open (see the scheduling disclosure in the Publish step: this
  // only fires while a tab is open, there is no server-side job queue).
  useEffect(() => {
    if (!state.hydrated) return;
    for (const post of state.posts) {
      for (const draft of post.drafts) {
        if (draft.status !== "scheduled" || !draft.scheduledFor || !draft.imageBase64) continue;
        const delay = Math.max(0, new Date(draft.scheduledFor).getTime() - Date.now());
        const timer = setTimeout(() => {
          publishDraft(post.id, draft.platformId, draft.imageBase64!, draft.caption);
        }, delay);
        timers.current.push(timer);
      }
    }
    // Only re-arm once, right after hydration — later schedule calls arm
    // their own timer directly in scheduleDraft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated]);

  const createDraft = useCallback(
    (
      organizationId: string,
      contentType: ContentTypeId,
      prompt: string,
      imageStyles: string[],
      targets: { platformId: string; accountId: string | null }[],
      tone: ContentTone = "professional"
    ) => {
      if (targets.length === 0) return "";
      const imagePrompt = buildImagePrompt(prompt, imageStyles);

      const post: Post = {
        id: makeId("post"),
        organizationId,
        contentType,
        prompt,
        createdAt: new Date().toISOString(),
        drafts: targets.map((target) => ({
          platformId: target.platformId,
          accountId: target.accountId,
          imageBase64: null,
          imageStyles,
          caption: "",
          hashtags: [],
          tone,
          externalPostId: null,
          scheduledFor: null,
          ...status("generating"),
        })),
      };
      dispatch({ type: "add_post", post });

      for (const target of targets) {
        const platformLabel = platformById(target.platformId)?.name ?? target.platformId;
        Promise.all([api.generateCaption(prompt, tone), api.generateImage(imagePrompt)])
          .then(([captionResult, imageResult]) => {
            dispatch({
              type: "update_draft",
              postId: post.id,
              platformId: target.platformId,
              updates: { caption: captionResult.caption, imageBase64: imageResult.imageBase64 },
            });
            return api.generateHashtags(captionResult.caption, platformLabel);
          })
          .then((hashtagsResult) => {
            dispatch({
              type: "update_draft",
              postId: post.id,
              platformId: target.platformId,
              updates: { hashtags: hashtagsResult.hashtags, ...status("ready") },
            });
          })
          .catch((err) => {
            dispatch({
              type: "update_draft",
              postId: post.id,
              platformId: target.platformId,
              updates: status("failed", apiErrorMessage(err)),
            });
          });
      }

      return post.id;
    },
    [platformById]
  );

  const regenerateImage = useCallback(
    (postId: string, platformId: string, correction?: string) => {
      const post = state.posts.find((p) => p.id === postId);
      const draft = post?.drafts.find((d) => d.platformId === platformId);
      if (!post || !draft) return;

      const basePrompt = buildImagePrompt(post.prompt, draft.imageStyles);
      const imagePrompt = correction?.trim() ? `${basePrompt}\n\nRevision: ${correction.trim()}` : basePrompt;

      dispatch({ type: "update_draft", postId, platformId, updates: status("generating") });
      api
        .generateImage(imagePrompt)
        .then((result) => {
          dispatch({
            type: "update_draft",
            postId,
            platformId,
            updates: { imageBase64: result.imageBase64, ...status("ready") },
          });
        })
        .catch((err) => {
          dispatch({ type: "update_draft", postId, platformId, updates: status("failed", apiErrorMessage(err)) });
        });
    },
    [state.posts]
  );

  const generateHashtagsFor = useCallback(
    async (postId: string, platformId: string) => {
      const post = state.posts.find((p) => p.id === postId);
      const draft = post?.drafts.find((d) => d.platformId === platformId);
      if (!post || !draft) return;
      const platformLabel = platformById(platformId)?.name ?? platformId;
      const result = await api.generateHashtags(draft.caption, platformLabel);
      dispatch({ type: "update_draft", postId, platformId, updates: { hashtags: result.hashtags } });
    },
    [state.posts, platformById]
  );

  const applyRewrite = useCallback(
    async (postId: string, platformId: string, action: RewriteAction) => {
      const post = state.posts.find((p) => p.id === postId);
      const draft = post?.drafts.find((d) => d.platformId === platformId);
      if (!draft) return;
      const result = await api.rewrite(draft.caption, action, draft.tone);
      dispatch({ type: "update_draft", postId, platformId, updates: { caption: result.content } });
    },
    [state.posts]
  );

  const updateDraftText = useCallback(
    (
      postId: string,
      platformId: string,
      updates: Partial<Pick<PlatformDraft, "caption" | "hashtags" | "tone" | "imageStyles">>
    ) => {
      dispatch({ type: "update_draft", postId, platformId, updates });
    },
    []
  );

  const applyAllSuggestions = useCallback(
    async (postId: string, platformId: string) => {
      const post = state.posts.find((p) => p.id === postId);
      const draft = post?.drafts.find((d) => d.platformId === platformId);
      if (!post || !draft) return;

      const { suggestions } = scorePost(draft);
      let caption = draft.caption;
      let hashtags = draft.hashtags;

      if (!suggestions.find((s) => s.id === "cta")?.met) {
        caption = `${caption.trim()}\n\n${defaultCtaFor(post.contentType)}`;
      }
      if (!suggestions.find((s) => s.id === "first-paragraph")?.met) {
        caption = breakLongFirstParagraph(caption);
      }
      if (!suggestions.find((s) => s.id === "benefits")?.met) {
        caption = `${caption.trim()}\n${defaultBenefitSentence()}`;
      }
      if (!suggestions.find((s) => s.id === "hook")?.met) {
        caption = /[!?]\s*$/.test(caption.trim()) ? caption : `${caption.trim()} 🎉`;
      }
      if (!suggestions.find((s) => s.id === "hashtags")?.met) {
        const platformLabel = platformById(platformId)?.name ?? platformId;
        const result = await api.generateHashtags(caption, platformLabel);
        hashtags = result.hashtags;
      }

      dispatch({ type: "update_draft", postId, platformId, updates: { caption, hashtags } });
    },
    [state.posts, platformById]
  );

  const saveAsDraft = useCallback((postId: string) => {
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;
    for (const draft of post.drafts) {
      if (draft.status !== "ready") continue;
      dispatch({ type: "update_draft", postId, platformId: draft.platformId, updates: status("draft") });
    }
  }, [state.posts]);

  const scheduleDraft = useCallback(
    (postId: string, platformId: string, whenIso: string) => {
      const post = state.posts.find((p) => p.id === postId);
      const draft = post?.drafts.find((d) => d.platformId === platformId);
      if (!draft || !draft.imageBase64) return;

      dispatch({
        type: "update_draft",
        postId,
        platformId,
        updates: { scheduledFor: whenIso, ...status("scheduled") },
      });

      const delay = Math.max(0, new Date(whenIso).getTime() - Date.now());
      const timer = setTimeout(() => {
        publishDraft(postId, platformId, draft.imageBase64!, draft.caption);
      }, delay);
      timers.current.push(timer);
    },
    [state.posts, publishDraft]
  );

  const submitPost = useCallback(
    (postId: string) => {
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;
      for (const draft of post.drafts) {
        if (draft.status !== "ready" || !draft.imageBase64) continue;
        publishDraft(postId, draft.platformId, draft.imageBase64, draft.caption);
      }
    },
    [state.posts, publishDraft]
  );

  const deletePost = useCallback((id: string) => {
    dispatch({ type: "delete_post", id });
  }, []);

  const postsForOrg = useCallback(
    (organizationId: string) => state.posts.filter((p) => p.organizationId === organizationId),
    [state.posts]
  );

  const value = useMemo<PostsContextValue>(
    () => ({
      state,
      createDraft,
      regenerateImage,
      generateHashtagsFor,
      applyRewrite,
      applyAllSuggestions,
      updateDraftText,
      saveAsDraft,
      scheduleDraft,
      submitPost,
      deletePost,
      postsForOrg,
    }),
    [
      state,
      createDraft,
      regenerateImage,
      generateHashtagsFor,
      applyRewrite,
      applyAllSuggestions,
      updateDraftText,
      saveAsDraft,
      scheduleDraft,
      submitPost,
      deletePost,
      postsForOrg,
    ]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts must be used within PostsProvider");
  }
  return ctx;
}

