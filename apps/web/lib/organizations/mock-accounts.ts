import type { ManagedAccount, Platform } from "./types";

/** Deterministic PRNG so a given connection's discovered list is stable. */
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return h;
}

const NAME_STEMS = [
  "Northbound", "Cedar & Vine", "Harborlight", "Fieldstone", "Amberwell",
  "Cobalt Row", "Redgrove", "Maple & Co", "Silverline", "Bright Harbor",
  "Ridgeway", "Copperfield", "Lantern Hill", "Westbrook", "Ironwood",
  "Salt & Timber", "Everline", "Foundry Nine", "Bluepoint", "Marlow",
  "Granite Coast", "Willowmere", "Hearthstone", "Driftwood", "Kestrel",
  "Oakmont", "Pinehurst", "Slate & Co", "Thistledown", "Wrenfield",
];

const NAME_SUFFIXES = [
  "Studio", "Collective", "Group", "Co.", "Clinic", "Market", "Kitchen",
  "Outfitters", "Gallery", "Lab", "Roasters", "Wellness", "Realty",
  "Design", "Athletics", "Bakery", "Ventures", "Media", "Works", "",
];

function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)];
}

export function toHandle(name: string): string {
  return (
    "@" +
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20)
  );
}

/** Generates a stable list of mock discovered accounts for one connection. */
export function generateMockAccounts(params: {
  connectionId: string;
  organizationId: string;
  platform: Platform;
  count: number;
}): ManagedAccount[] {
  const { connectionId, organizationId, platform, count } = params;
  const rng = mulberry32(hashSeed(connectionId));
  const used = new Set<string>();
  const accounts: ManagedAccount[] = [];

  for (let i = 0; i < count; i++) {
    let name = `${pick(rng, NAME_STEMS)} ${pick(rng, NAME_SUFFIXES)}`.trim();
    let attempt = 0;
    while (used.has(name) && attempt < 5) {
      name = `${pick(rng, NAME_STEMS)} ${pick(rng, NAME_SUFFIXES)}`.trim();
      attempt++;
    }
    used.add(name);

    const type =
      rng() < 0.82
        ? platform.accountNoun
        : rng() < 0.5
          ? "Locations group"
          : "Regional page";

    accounts.push({
      id: `${connectionId}-acct-${i}`,
      connectionId,
      organizationId,
      platformId: platform.id,
      externalId: `${platform.id}_${hashSeed(name + i).toString(36)}`,
      name,
      handle: toHandle(name),
      type,
      followers: Math.round(80 + rng() * rng() * 240000),
      selected: false,
    });
  }

  return accounts.sort((a, b) => b.followers - a.followers);
}
