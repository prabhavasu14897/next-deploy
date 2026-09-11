"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Post, TabStatus } from "@/lib/posts/types";
import { usePosts } from "@/lib/posts/store";
import { usePlatforms } from "@/lib/platforms/store";
import { useTemplates } from "@/lib/templates/store";
import { formatDate } from "@/lib/organizations/derive";
import { DEMO_IMAGE_BASE64 } from "@/lib/demo-data";
import { platformIconSrc } from "@/components/organizations/PlatformBadge";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchIcon, SendIcon, TrashIcon } from "@/components/ui/icons";

const HEADERS = ["Content", "Platform", "Link", "Created", "Actions"] as const;
const PAGE_SIZE = 10;

const TONE_BY_STATUS: Record<TabStatus, "neutral" | "success" | "error" | "warning"> = {
  generating: "neutral",
  ready: "neutral",
  draft: "neutral",
  scheduled: "warning",
  posting: "neutral",
  posted: "success",
  failed: "error",
};

const STATUS_LABELS: Record<TabStatus, string> = {
  generating: "generating",
  ready: "ready",
  draft: "draft",
  scheduled: "scheduled",
  posting: "posting",
  posted: "posted",
  failed: "failed",
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
  { value: "failed", label: "Failed" },
  { value: "in_progress", label: "In progress" },
];

/** A real, clickable URL to the live post — only known for platforms whose
 *  permalink format is confirmed. `externalPostId` is the URN LinkedIn's
 *  Posts API returns (e.g. "urn:li:share:123..."), which its own feed
 *  route accepts directly. */
function externalPostUrl(platformName: string, externalPostId: string): string | undefined {
  if (platformName.trim().toLowerCase() === "linkedin") {
    return `https://www.linkedin.com/feed/update/${externalPostId}/`;
  }
  return undefined;
}

function postMatchesStatusFilter(post: Post, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "in_progress") return post.drafts.some((d) => d.status === "generating" || d.status === "posting");
  return post.drafts.some((d) => d.status === filter);
}

export function PostHistoryTable({ posts }: { posts: Post[] }) {
  const { platformById, state: platformsState } = usePlatforms();
  const { deletePost, submitPost } = usePosts();
  const { templateById } = useTemplates();
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const type = templateById(post.contentType);
      if (q) {
        const haystack = `${type?.label ?? post.contentType} ${post.prompt} ${post.drafts.map((d) => d.caption).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (platformFilter !== "all" && !post.drafts.some((d) => d.platformId === platformFilter)) return false;
      if (!postMatchesStatusFilter(post, statusFilter)) return false;
      return true;
    });
  }, [posts, query, platformFilter, statusFilter, templateById]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search posts"
            aria-label="Search posts"
            className="w-full pl-8"
          />
        </div>
        <Select
          value={platformFilter}
          onChange={(e) => {
            setPlatformFilter(e.target.value);
            setPage(0);
          }}
          aria-label="Filter by platform"
          className="w-full sm:w-44"
        >
          <option value="all">All Platforms</option>
          {platformsState.platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          aria-label="Filter by status"
          className="w-full sm:w-44"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant dark:border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant dark:border-white/10 bg-surface-container-low dark:bg-white/[0.03]">
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className={`px-2 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant sm:px-4 ${
                      header === "Actions" ? "text-right" : ""
                    } ${header === "Created" || header === "Link" ? "hidden sm:table-cell" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} className="px-2 py-14 text-center sm:px-4">
                    <EmptyState
                      title="No posts found"
                      description={
                        posts.length === 0
                          ? "Generated posts for this organization will appear here."
                          : "No posts match your filters."
                      }
                    />
                  </td>
                </tr>
              ) : (
                pageItems.map((post) => {
                  const type = templateById(post.contentType);
                  return (
                    <tr key={post.id} className="border-b border-outline-variant dark:border-white/[0.06] transition-colors last:border-b-0 hover:bg-surface-container-highest dark:hover:bg-white/[0.04]">
                      <td className="px-2 py-3 sm:px-4">
                        <span className="text-[14px] font-semibold text-on-surface">{type?.label ?? post.contentType}</span>
                      </td>
                      <td className="px-2 py-3 sm:px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {post.drafts.map((draft) => (
                            <Badge
                              key={draft.platformId}
                              tone={TONE_BY_STATUS[draft.status]}
                              title={draft.status === "failed" ? draft.error ?? undefined : undefined}
                            >
                              {platformById(draft.platformId)?.name ?? draft.platformId} · {STATUS_LABELS[draft.status]}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {post.drafts.map((draft) => {
                            const platform = platformById(draft.platformId);
                            const platformName = platform?.name ?? draft.platformId;
                            // Demo/seeded posts carry a placeholder image rather than
                            // a real generated one — show that platform's brand mark
                            // (its own uploaded logo first, else the built-in brand
                            // mark) instead of the meaningless placeholder thumbnail.
                            const isPlaceholder = draft.imageBase64 === DEMO_IMAGE_BASE64;
                            const logoSrc = isPlaceholder
                              ? platformIconSrc(platform ?? { name: platformName, logoDataUrl: null })
                              : undefined;

                            if (logoSrc) {
                              return (
                                <span
                                  key={draft.platformId}
                                  title={`Sample post for ${platformName} — no real image generated`}
                                  className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded border border-outline-variant dark:border-white/15"
                                >
                                  {platform?.logoDataUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element -- data: URL upload, next/image can't optimize these.
                                    <img src={logoSrc} alt={platformName} className="h-full w-full object-cover" />
                                  ) : (
                                    <Image src={logoSrc} alt={platformName} width={32} height={32} className="h-full w-full object-cover" />
                                  )}
                                </span>
                              );
                            }

                            if (draft.imageBase64) {
                              const postUrl =
                                draft.status === "posted" && draft.externalPostId
                                  ? externalPostUrl(platformName, draft.externalPostId)
                                  : undefined;
                              return (
                                <a
                                  key={draft.platformId}
                                  href={postUrl ?? `data:image/png;base64,${draft.imageBase64}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={postUrl ? `Open the live post on ${platformName}` : `Open the image posted to ${platformName}`}
                                  className="block h-8 w-8 shrink-0 overflow-hidden rounded border border-outline-variant dark:border-white/15 transition-opacity hover:opacity-80"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URL thumbnail, next/image can't optimize these. */}
                                  <img
                                    src={`data:image/png;base64,${draft.imageBase64}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </a>
                              );
                            }

                            return (
                              <span key={draft.platformId} className="text-[12px] text-on-surface-variant">
                                —
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <p className="text-[12px] text-on-surface-variant">{formatDate(post.createdAt)}</p>
                      </td>
                      <td className="px-2 py-3 sm:px-4">
                        <div className="flex justify-end gap-1">
                          {post.drafts.some(
                            (d) => (d.status === "draft" || d.status === "ready" || d.status === "failed") && d.imageBase64
                          ) && (
                            <IconButton
                              label={
                                post.drafts.some((d) => d.status === "failed")
                                  ? `Retry ${type?.label ?? "post"}`
                                  : `Post ${type?.label ?? "post"} now`
                              }
                              onClick={() => submitPost(post.id)}
                            >
                              <SendIcon className="h-4 w-4" />
                            </IconButton>
                          )}
                          <IconButton label={`Delete ${type?.label ?? "post"}`} onClick={() => setDeleteTarget(post)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-outline-variant dark:border-white/10 px-4 py-2.5">
            <p className="text-[12px] text-on-surface-variant">
              Page {currentPage + 1} of {pageCount}
            </p>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titleId="delete-post-title"
        title="Delete this post?"
        description="This removes it from history. This cannot be undone."
        confirmLabel="Delete post"
        onConfirm={() => {
          if (deleteTarget) deletePost(deleteTarget.id);
        }}
      />
    </div>
  );
}
