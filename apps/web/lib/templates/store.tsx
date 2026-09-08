"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { ContentTemplate, ContentTemplateDraft } from "./types";
import { SEED_TEMPLATES } from "./seed-templates";
import { makeId } from "../organizations/id";

const STORAGE_KEY = "ascentware.smp.templates.v1";

interface State {
  templates: ContentTemplate[];
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Omit<State, "hydrated"> | null }
  | { type: "create_template"; template: ContentTemplate }
  | { type: "update_template"; id: string; updates: Partial<ContentTemplateDraft> }
  | { type: "delete_template"; id: string };

const initialState: State = { templates: [], hydrated: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      // First-ever load (nothing in storage yet): seed from the app's
      // original six templates rather than starting empty.
      if (!action.state) {
        return { templates: SEED_TEMPLATES, hydrated: true };
      }
      return { ...action.state, hydrated: true };
    }
    case "create_template":
      return { ...state, templates: [...state.templates, action.template] };
    case "update_template":
      return {
        ...state,
        templates: state.templates.map((t) => (t.id === action.id ? { ...t, ...action.updates } : t)),
      };
    case "delete_template":
      return { ...state, templates: state.templates.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

interface TemplatesContextValue {
  state: State;
  createTemplate: (draft: ContentTemplateDraft) => string;
  updateTemplate: (id: string, updates: Partial<ContentTemplateDraft>) => void;
  deleteTemplate: (id: string) => void;
  templateById: (id: string) => ContentTemplate | undefined;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", state: raw ? JSON.parse(raw) : null });
    } catch {
      dispatch({ type: "hydrate", state: null });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: state.templates }));
    } catch {
      // storage unavailable (private mode, quota) — state still works in-memory
    }
  }, [state]);

  const createTemplate = useCallback((draft: ContentTemplateDraft) => {
    const id = makeId("template");
    const template: ContentTemplate = { id, ...draft };
    dispatch({ type: "create_template", template });
    return id;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<ContentTemplateDraft>) => {
    dispatch({ type: "update_template", id, updates });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    dispatch({ type: "delete_template", id });
  }, []);

  const templateById = useCallback(
    (id: string) => state.templates.find((t) => t.id === id),
    [state.templates]
  );

  const value = useMemo<TemplatesContextValue>(
    () => ({ state, createTemplate, updateTemplate, deleteTemplate, templateById }),
    [state, createTemplate, updateTemplate, deleteTemplate, templateById]
  );

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>;
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext);
  if (!ctx) {
    throw new Error("useTemplates must be used within TemplatesProvider");
  }
  return ctx;
}
