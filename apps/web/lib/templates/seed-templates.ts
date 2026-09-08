import type { ContentTemplate } from "./types";

/** SEED TEMPLATES — one-time seed data for lib/templates/store.tsx's first
 *  hydrate (nothing in localStorage yet). Same ids the app has always used
 *  for these six built-ins, so existing post history (which references a
 *  template by this id string) keeps working with zero migration — the
 *  same stability guarantee apps/api/prisma/seed.ts gives Platform rows
 *  (Templates still lives in localStorage, unlike Platforms, which moved
 *  to a real database). The real catalog now lives in the store,
 *  admin-editable via the Templates surface; this file no longer IS the
 *  catalog. */
export const SEED_TEMPLATES: ContentTemplate[] = [
  {
    id: "jd",
    label: "Job / Hiring",
    description: "A hiring graphic for an open role.",
    iconKey: "briefcase",
    promptTemplate:
      "Create a LinkedIn hiring post for {orgName}.\nRole: \nExperience: \nLocation: \nSkills: \n\nAdd required qualifications, perks, and how to apply.",
    defaultCta: "If you're ready for the challenge, apply now!",
  },
  {
    id: "birthday",
    label: "Birthday",
    description: "A workplace birthday celebration graphic.",
    iconKey: "gift",
    promptTemplate:
      "Create a warm birthday celebration post from {orgName} for a teammate.\nName: \nRole: \n\nKeep it festive and personal.",
    defaultCta: "Join us in wishing them a fantastic year ahead!",
  },
  {
    id: "workAnniversary",
    label: "Work Anniversary",
    description: "Celebrate a teammate's work anniversary.",
    iconKey: "award",
    promptTemplate:
      "Create a work-anniversary celebration post from {orgName}.\nName: \nRole: \nYears at company: \n\nThank them for their contributions.",
    defaultCta: "Join us in celebrating this milestone!",
  },
  {
    id: "achievement",
    label: "Achievement",
    description: "Congratulate a team or individual milestone.",
    iconKey: "trophy",
    promptTemplate:
      "Create an achievement/congratulations post from {orgName}.\nWho/what achieved: \nThe achievement: \n\nCelebrate the milestone.",
    defaultCta: "Congratulations to everyone involved!",
  },
  {
    id: "event",
    label: "Event",
    description: "An announcement graphic for an upcoming event.",
    iconKey: "calendar",
    promptTemplate:
      "Create an event announcement post for {orgName}.\nEvent name: \nDate: \nLocation: \n\nInvite people to attend.",
    defaultCta: "RSVP today — we'd love to see you there!",
  },
  {
    id: "generalPost",
    label: "General Post",
    description: "A general company update or announcement.",
    iconKey: "megaphone",
    promptTemplate: "Create a general company update post for {orgName}.\nTopic: \n\nKeep it clear and on-brand.",
    defaultCta: "Learn more today!",
  },
];
