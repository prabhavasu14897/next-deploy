"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { CredentialField, Platform, PlatformDraft, PlatformIntegrationConfig } from "../organizations/types";
import * as api from "./api-client";
import type { PlatformPayload, PlatformResponse } from "./api-client";

interface State {
  platforms: Platform[];
  integrations: Record<string, PlatformIntegrationConfig>;
  hydrated: boolean;
}

type Action = { type: "set"; platforms: Platform[]; integrations: Record<string, PlatformIntegrationConfig> };

const initialState: State = {
  platforms: [],
  integrations: {},
  hydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return { platforms: action.platforms, integrations: action.integrations, hydrated: true };
    default:
      return state;
  }
}

// The catalog now lives in a real database (see apps/api's Platforms
// module) — this turns the API's response shape into the same
// Platform/PlatformIntegrationConfig pair every existing consumer already
// expects, so nothing downstream needs to change. A secret field's value
// is never sent back by the API; `credentials[key]` becomes a masked
// placeholder when one is set, or "" when it isn't — good enough for any
// "is this configured" check, never the real value.
function toPlatformAndIntegration(response: PlatformResponse): {
  platform: Platform;
  integration: PlatformIntegrationConfig;
} {
  const platform: Platform = {
    id: response.id,
    name: response.name,
    summary: response.summary,
    accountNoun: response.accountNoun,
    accountNounPlural: response.accountNounPlural,
    apiBaseUrl: response.apiBaseUrl,
  };

  const credentialFields: CredentialField[] = response.credentialFields.map((f) => ({
    key: f.key,
    label: f.label,
    secret: f.secret,
  }));
  const credentials: Record<string, string> = Object.fromEntries(
    response.credentialFields.map((f) => [f.key, f.secret ? (f.hasValue ? "••••••••" : "") : f.value ?? ""])
  );

  const integration: PlatformIntegrationConfig = {
    platformId: response.id,
    authType: "oauth2-mock",
    scopes: [],
    // Vestigial — real Connect no longer simulates latency/failure/discovery
    // volume, but the type is shared with Organizations' older shape.
    simulatedLatencyMsRange: [0, 0],
    simulatedFailureRate: 0,
    accountCountRange: [0, 0],
    credentialFields,
    credentials,
  };

  return { platform, integration };
}

function toPayload(draft: PlatformDraft): PlatformPayload {
  return {
    name: draft.name,
    summary: draft.summary,
    accountNoun: draft.accountNoun,
    accountNounPlural: draft.accountNounPlural,
    apiBaseUrl: draft.apiBaseUrl,
    credentialFields: draft.credentialFields.map((f) => ({
      key: f.key,
      label: f.label,
      secret: f.secret,
      value: draft.credentials[f.key] ?? "",
    })),
  };
}

interface PlatformsContextValue {
  state: State;
  createPlatform: (draft: PlatformDraft) => Promise<string>;
  updatePlatform: (id: string, updates: PlatformDraft) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  platformById: (id: string) => Platform | undefined;
  integrationFor: (id: string) => PlatformIntegrationConfig | undefined;
}

const PlatformsContext = createContext<PlatformsContextValue | null>(null);

export function PlatformsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refetch = useCallback(async () => {
    try {
      const responses = await api.listPlatforms();
      const platforms: Platform[] = [];
      const integrations: Record<string, PlatformIntegrationConfig> = {};
      for (const response of responses) {
        const pair = toPlatformAndIntegration(response);
        platforms.push(pair.platform);
        integrations[pair.platform.id] = pair.integration;
      }
      dispatch({ type: "set", platforms, integrations });
    } catch {
      // API unreachable — hydrate empty rather than hang forever; surfaces
      // as the same honest empty state every other zero-data view shows.
      dispatch({ type: "set", platforms: [], integrations: {} });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createPlatform = useCallback(
    async (draft: PlatformDraft) => {
      const created = await api.createPlatform(toPayload(draft));
      await refetch();
      return created.id;
    },
    [refetch]
  );

  const updatePlatform = useCallback(
    async (id: string, updates: PlatformDraft) => {
      await api.updatePlatform(id, toPayload(updates));
      await refetch();
    },
    [refetch]
  );

  const deletePlatform = useCallback(
    async (id: string) => {
      await api.deletePlatform(id);
      await refetch();
    },
    [refetch]
  );

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
