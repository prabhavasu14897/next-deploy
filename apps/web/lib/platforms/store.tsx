"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CredentialField, Platform, PlatformDraft, PlatformIntegrationConfig } from "../organizations/types";
import { SEED_PLATFORMS, SEED_PLATFORM_INTEGRATIONS } from "../organizations/platform-catalog";
import { makeId } from "../organizations/id";

const STORAGE_KEY = "ascentware.smp.platforms.v1";

interface State {
  platforms: Platform[];
  integrations: Record<string, PlatformIntegrationConfig>;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Omit<State, "hydrated"> | null }
  | { type: "create_platform"; platform: Platform; integration: PlatformIntegrationConfig }
  | { type: "update_platform"; id: string; updates: Partial<PlatformDraft> }
  | { type: "delete_platform"; id: string };

const initialState: State = {
  platforms: [],
  integrations: {},
  hydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      // First-ever load (nothing in storage yet): seed from the app's
      // original three platforms rather than starting empty.
      if (!action.state) {
        return { platforms: SEED_PLATFORMS, integrations: SEED_PLATFORM_INTEGRATIONS, hydrated: true };
      }
      return { ...action.state, hydrated: true };
    }
    case "create_platform":
      return {
        ...state,
        platforms: [...state.platforms, action.platform],
        integrations: { ...state.integrations, [action.platform.id]: action.integration },
      };
    case "update_platform": {
      const { credentialFields, credentials, ...catalogUpdates } = action.updates;
      return {
        ...state,
        platforms: state.platforms.map((p) => (p.id === action.id ? { ...p, ...catalogUpdates } : p)),
        integrations:
          credentialFields === undefined && credentials === undefined
            ? state.integrations
            : {
                ...state.integrations,
                [action.id]: {
                  ...state.integrations[action.id],
                  ...(credentialFields !== undefined ? { credentialFields } : {}),
                  ...(credentials !== undefined ? { credentials } : {}),
                },
              },
      };
    }
    case "delete_platform":
      return {
        ...state,
        platforms: state.platforms.filter((p) => p.id !== action.id),
        integrations: Object.fromEntries(
          Object.entries(state.integrations).filter(([id]) => id !== action.id)
        ),
      };
    default:
      return state;
  }
}

interface PlatformsContextValue {
  state: State;
  createPlatform: (draft: PlatformDraft) => string;
  updatePlatform: (id: string, updates: Partial<PlatformDraft>) => void;
  deletePlatform: (id: string) => void;
  platformById: (id: string) => Platform | undefined;
  integrationFor: (id: string) => PlatformIntegrationConfig | undefined;
}

const PlatformsContext = createContext<PlatformsContextValue | null>(null);

export function PlatformsProvider({ children }: { children: React.ReactNode }) {
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
      const persisted = { platforms: state.platforms, integrations: state.integrations };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // storage unavailable (private mode, quota) — state still works in-memory
    }
  }, [state]);

  const createPlatform = useCallback((draft: PlatformDraft) => {
    const id = makeId("platform");
    const platform: Platform = {
      id,
      name: draft.name.trim(),
      summary: draft.summary.trim(),
      accountNoun: draft.accountNoun.trim(),
      accountNounPlural: draft.accountNounPlural.trim(),
    };
    const fields: CredentialField[] = draft.credentialFields;
    const integration: PlatformIntegrationConfig = {
      platformId: id,
      authType: "oauth2-mock",
      scopes: [],
      simulatedLatencyMsRange: [900, 1800],
      simulatedFailureRate: 0.15,
      accountCountRange: [3, 40],
      credentialFields: fields,
      credentials: draft.credentials,
    };
    dispatch({ type: "create_platform", platform, integration });
    return id;
  }, []);

  const updatePlatform = useCallback((id: string, updates: Partial<PlatformDraft>) => {
    dispatch({ type: "update_platform", id, updates });
  }, []);

  const deletePlatform = useCallback((id: string) => {
    dispatch({ type: "delete_platform", id });
  }, []);

  const platformById = useCallback(
    (id: string) => state.platforms.find((p) => p.id === id),
    [state.platforms]
  );

  const integrationFor = useCallback(
    (id: string) => state.integrations[id],
    [state.integrations]
  );

  const value = useMemo<PlatformsContextValue>(
    () => ({ state, createPlatform, updatePlatform, deletePlatform, platformById, integrationFor }),
    [state, createPlatform, updatePlatform, deletePlatform, platformById, integrationFor]
  );

  return <PlatformsContext.Provider value={value}>{children}</PlatformsContext.Provider>;
}

export function usePlatforms() {
  const ctx = useContext(PlatformsContext);
  if (!ctx) {
    throw new Error("usePlatforms must be used within PlatformsProvider");
  }
  return ctx;
}
