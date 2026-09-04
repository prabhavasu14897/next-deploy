"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type {
  DraftPage,
  ManagedAccount,
  Organization,
  OrganizationDraft,
  OrganizationPlatformConnection,
} from "./types";
import { generateMockAccounts, toHandle } from "./mock-accounts";
import { makeId } from "./id";
import { usePlatforms } from "../platforms/store";

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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const {
    state: { platforms, integrations },
  } = usePlatforms();

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

  const connectPlatform = useCallback(
    (organizationId: string, platformId: string) => {
      const integration = integrations[platformId];
      const platform = platforms.find((p) => p.id === platformId);
      if (!integration || !platform) return;

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
          discoveringAccounts: false,
        },
      });

      const [minLatency, maxLatency] = integration.simulatedLatencyMsRange;
      const latency = minLatency + Math.random() * (maxLatency - minLatency);

      const authTimer = setTimeout(() => {
        const failed = Math.random() < integration.simulatedFailureRate;

        if (failed) {
          dispatch({
            type: "connection_upsert",
            connection: {
              id: connectionId,
              organizationId,
              platformId,
              status: "error",
              connectedAt: null,
              lastError: `${platform.name} declined the authorization request. This is a simulated failure — no real ${platform.name} account was contacted.`,
              accountsDiscovered: existing?.accountsDiscovered ?? false,
              discoveringAccounts: false,
            },
          });
          return;
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
            accountsDiscovered: existing?.accountsDiscovered ?? false,
            discoveringAccounts: true,
          },
        });

        const discoveryTimer = setTimeout(() => {
          const [minCount, maxCount] = integration.accountCountRange;
          const count = Math.round(
            minCount + Math.random() * (maxCount - minCount)
          );
          const accounts = generateMockAccounts({
            connectionId,
            organizationId,
            platform,
            count,
          });
          dispatch({ type: "set_accounts", connectionId, accounts });
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
        }, 700 + Math.random() * 500);
        timers.current.push(discoveryTimer);
      }, latency);
      timers.current.push(authTimer);
    },
    [state.connections, platforms, integrations]
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
