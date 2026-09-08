"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type {
  DraftPage,
  ManagedAccount,
  Organization,
  OrganizationDraft,
  OrganizationPlatformConnection,
} from "./types";
import { toHandle } from "./mock-accounts";
import { makeId } from "./id";
import { usePlatforms } from "../platforms/store";
import * as platformsApi from "../platforms/api-client";
import type { ApiError } from "../platforms/api-client";

const STORAGE_KEY = "ascentware.smp.organizations.v1";

interface State {
  organizations: Organization[];
  connections: OrganizationPlatformConnection[];
  accounts: ManagedAccount[];
  activeOrgId: string | null;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Omit<State, "hydrated"> | null }
  | { type: "create_org"; org: Organization }
  | {
      type: "update_org";
      id: string;
      updates: Partial<Omit<Organization, "id" | "createdAt">>;
    }
  | { type: "delete_org"; id: string }
  | { type: "set_active"; id: string | null }
  | {
      type: "connection_upsert";
      connection: OrganizationPlatformConnection;
    }
  | { type: "set_accounts"; connectionId: string; accounts: ManagedAccount[] }
  | { type: "add_account"; account: ManagedAccount }
  | { type: "toggle_account"; accountId: string };

const initialState: State = {
  organizations: [],
  connections: [],
  accounts: [],
  activeOrgId: null,
  hydrated: false,
};

function sanitizeConnections(
  connections: OrganizationPlatformConnection[]
): OrganizationPlatformConnection[] {
  // A page reload has no live timer to resolve an in-flight connect or
  // discovery, so an interrupted one resets to a state the UI can act on
  // again rather than showing a spinner that will never finish.
  return connections.map((c) => ({
    ...c,
    status: c.status === "connecting" ? "not_connected" : c.status,
    discoveringAccounts: false,
  }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      if (!action.state) return { ...state, hydrated: true };
      return {
        ...action.state,
        connections: sanitizeConnections(action.state.connections),
        hydrated: true,
      };
    }
    case "create_org":
      return {
        ...state,
        organizations: [...state.organizations, action.org],
        activeOrgId: action.org.id,
      };
    case "update_org":
      return {
        ...state,
        organizations: state.organizations.map((o) =>
          o.id === action.id ? { ...o, ...action.updates } : o
        ),
      };
    case "delete_org": {
      const connectionIds = new Set(
        state.connections
          .filter((c) => c.organizationId === action.id)
          .map((c) => c.id)
      );
      return {
        ...state,
        organizations: state.organizations.filter((o) => o.id !== action.id),
        connections: state.connections.filter(
          (c) => c.organizationId !== action.id
        ),
        accounts: state.accounts.filter(
          (a) => !connectionIds.has(a.connectionId)
        ),
        activeOrgId: state.activeOrgId === action.id ? null : state.activeOrgId,
      };
    }
    case "set_active":
      return { ...state, activeOrgId: action.id };
    case "connection_upsert": {
      const exists = state.connections.some(
        (c) => c.id === action.connection.id
      );
      return {
        ...state,
        connections: exists
          ? state.connections.map((c) =>
              c.id === action.connection.id ? action.connection : c
            )
          : [...state.connections, action.connection],
      };
    }
    case "set_accounts": {
      const kept = state.accounts.filter(
        (a) => a.connectionId !== action.connectionId
      );
      return { ...state, accounts: [...kept, ...action.accounts] };
    }
    case "add_account":
      return { ...state, accounts: [...state.accounts, action.account] };
    case "toggle_account":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.accountId ? { ...a, selected: !a.selected } : a
        ),
      };
    default:
      return state;
  }
}

interface OrganizationsContextValue {
  state: State;
  createOrganization: (draft: OrganizationDraft) => string;
  updateOrganization: (id: string, updates: Partial<Omit<Organization, "id" | "createdAt">>) => void;
  deleteOrganization: (id: string) => void;
  setActiveOrganization: (id: string | null) => void;
  connectPlatform: (organizationId: string, platformId: string) => void;
  toggleAccountSelected: (accountId: string) => void;
  addManualAccounts: (organizationId: string, platformId: string, pages: DraftPage[]) => void;
  addAccount: (organizationId: string, platformId: string, page: { name: string; type: string; followers: number }) => void;
  connectionFor: (
    organizationId: string,
    platformId: string
  ) => OrganizationPlatformConnection | undefined;
  accountsFor: (connectionId: string) => ManagedAccount[];
}

const OrganizationsContext = createContext<OrganizationsContextValue | null>(
  null
);

export function OrganizationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { platforms },
  } = usePlatforms();

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
      const persisted = {
        organizations: state.organizations,
        connections: state.connections,
        accounts: state.accounts,
        activeOrgId: state.activeOrgId,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // storage unavailable (private mode, quota) — state still works in-memory
    }
  }, [state]);

  const createOrganization = useCallback((draft: OrganizationDraft) => {
    const org: Organization = {
      id: makeId("org"),
      name: draft.name.trim(),
      code: draft.code.trim(),
      logoDataUrl: draft.logoDataUrl,
      description: draft.description.trim(),
      website: draft.website.trim(),
      industry: draft.industry,
      country: draft.country,
      timezone: draft.timezone,
      status: draft.status,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "create_org", org });
    return org.id;
  }, []);

  const updateOrganization = useCallback(
    (id: string, updates: Partial<Omit<Organization, "id" | "createdAt">>) => {
      dispatch({ type: "update_org", id, updates });
    },
    []
  );

  const deleteOrganization = useCallback((id: string) => {
    dispatch({ type: "delete_org", id });
  }, []);

  const setActiveOrganization = useCallback((id: string | null) => {
    dispatch({ type: "set_active", id });
  }, []);

  const connectionFor = useCallback(
    (organizationId: string, platformId: string) =>
      state.connections.find(
        (c) => c.organizationId === organizationId && c.platformId === platformId
      ),
    [state.connections]
  );

  const accountsFor = useCallback(
    (connectionId: string) =>
      state.accounts.filter((a) => a.connectionId === connectionId),
    [state.accounts]
  );

  // Real connection — calls the Platforms API, which resolves the DB-stored,
  // decrypted credentials and makes an actual authenticated call to the
  // platform (a bespoke integration for LinkedIn/Facebook, a generic
  // credential-check for anything else). No more simulated latency/failure.
  const connectPlatform = useCallback(
    (organizationId: string, platformId: string) => {
      const platform = platforms.find((p) => p.id === platformId);
      if (!platform) return;

      const existing = state.connections.find(
        (c) => c.organizationId === organizationId && c.platformId === platformId
      );
      const connectionId = existing?.id ?? makeId("conn");

      dispatch({
        type: "connection_upsert",
        connection: {
          id: connectionId,
          organizationId,
          platformId,
          status: "connecting",
          connectedAt: null,
          lastError: null,
          accountsDiscovered: existing?.accountsDiscovered ?? false,
          discoveringAccounts: true,
        },
      });

      platformsApi
        .connectPlatform(platformId)
        .then((result) => {
          if (result.accounts.length > 0) {
            const accounts: ManagedAccount[] = result.accounts.map((a) => ({
              id: makeId("acct"),
              connectionId,
              organizationId,
              platformId,
              externalId: a.externalId,
              name: a.name,
              handle: a.handle,
              type: a.type,
              followers: a.followers,
              selected: false,
            }));
            dispatch({ type: "set_accounts", connectionId, accounts });
          }
          dispatch({
            type: "connection_upsert",
            connection: {
              id: connectionId,
              organizationId,
              platformId,
              status: "connected",
              connectedAt: new Date().toISOString(),
              lastError: null,
              accountsDiscovered: true,
              discoveringAccounts: false,
            },
          });
        })
        .catch((err) => {
          dispatch({
            type: "connection_upsert",
            connection: {
              id: connectionId,
              organizationId,
              platformId,
              status: "error",
              connectedAt: null,
              lastError: (err as ApiError)?.message ?? `Couldn't connect to ${platform.name}.`,
              accountsDiscovered: existing?.accountsDiscovered ?? false,
              discoveringAccounts: false,
            },
          });
        });
    },
    [state.connections, platforms]
  );

  const toggleAccountSelected = useCallback((accountId: string) => {
    dispatch({ type: "toggle_account", accountId });
  }, []);

  // For pages typed in by hand (the create wizard's Add Pages / Accounts
  // step): skip connectPlatform's simulated OAuth + random discovery
  // entirely and persist exactly what the user entered, already connected.
  const addManualAccounts = useCallback(
    (organizationId: string, platformId: string, pages: DraftPage[]) => {
      if (pages.length === 0) return;
      const connectionId = makeId("conn");
      dispatch({
        type: "connection_upsert",
        connection: {
          id: connectionId,
          organizationId,
          platformId,
          status: "connected",
          connectedAt: new Date().toISOString(),
          lastError: null,
          accountsDiscovered: true,
          discoveringAccounts: false,
        },
      });
      const accounts: ManagedAccount[] = pages.map((page) => ({
        id: makeId("acct"),
        connectionId,
        organizationId,
        platformId,
        externalId: makeId("ext"),
        name: page.name,
        handle: toHandle(page.name),
        type: page.type,
        followers: page.followers,
        selected: page.selected,
      }));
      dispatch({ type: "set_accounts", connectionId, accounts });
    },
    []
  );

  // Adding one page to an organization that may already have a connection
  // (with its own existing accounts) for this platform — reuses that
  // connection rather than minting a duplicate the way addManualAccounts
  // does for a brand-new organization; marks it connected if it wasn't.
  const addAccount = useCallback(
    (organizationId: string, platformId: string, page: { name: string; type: string; followers: number }) => {
      const existing = state.connections.find(
        (c) => c.organizationId === organizationId && c.platformId === platformId
      );
      const connectionId = existing?.id ?? makeId("conn");
      if (!existing || existing.status !== "connected") {
        dispatch({
          type: "connection_upsert",
          connection: {
            id: connectionId,
            organizationId,
            platformId,
            status: "connected",
            connectedAt: existing?.connectedAt ?? new Date().toISOString(),
            lastError: null,
            accountsDiscovered: true,
            discoveringAccounts: false,
          },
        });
      }
      dispatch({
        type: "add_account",
        account: {
          id: makeId("acct"),
          connectionId,
          organizationId,
          platformId,
          externalId: makeId("ext"),
          name: page.name,
          handle: toHandle(page.name),
          type: page.type,
          followers: page.followers,
          selected: true,
        },
      });
    },
    [state.connections]
  );

  const value = useMemo<OrganizationsContextValue>(
    () => ({
      state,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      setActiveOrganization,
      connectPlatform,
      toggleAccountSelected,
      addManualAccounts,
      addAccount,
      connectionFor,
      accountsFor,
    }),
    [
      state,
      createOrganization,
      updateOrganization,
      deleteOrganization,
      setActiveOrganization,
      connectPlatform,
      toggleAccountSelected,
      addManualAccounts,
      addAccount,
      connectionFor,
      accountsFor,
    ]
  );

  return (
    <OrganizationsContext.Provider value={value}>
      {children}
    </OrganizationsContext.Provider>
  );
}

export function useOrganizations() {
  const ctx = useContext(OrganizationsContext);
  if (!ctx) {
    throw new Error("useOrganizations must be used within OrganizationsProvider");
  }
  return ctx;
}
