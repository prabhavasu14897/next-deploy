import type { ContentType } from "./types";
import {
  AwardIcon,
  BriefcaseIcon,
  CalendarIcon,
  GiftIcon,
  MegaphoneIcon,
  TrophyIcon,
} from "@/components/ui/icons";

/** The fixed set of content types the Post wizard starts from. Picking one
 *  inserts an editable starter prompt into the freeform prompt step —
 *  adding a 7th type is one new entry here, no new component code. */
export const CONTENT_TYPES: ContentType[] = [
  {
    id: "jd",
    label: "Job / Hiring",
    description: "A hiring graphic for an open role.",
    Icon: BriefcaseIcon,
    defaultPrompt: (orgName) =>
      `Create a LinkedIn hiring post for ${orgName}.\nRole: \nExperience: \nLocation: \nSkills: \n\nAdd required qualifications, perks, and how to apply.`,
  },
  {
    id: "birthday",
    label: "Birthday",
    description: "A workplace birthday celebration graphic.",
    Icon: GiftIcon,
    defaultPrompt: (orgName) =>
      `Create a warm birthday celebration post from ${orgName} for a teammate.\nName: \nRole: \n\nKeep it festive and personal.`,
  },
  {
    id: "workAnniversary",
    label: "Work Anniversary",
    description: "Celebrate a teammate's work anniversary.",
    Icon: AwardIcon,
    defaultPrompt: (orgName) =>
      `Create a work-anniversary celebration post from ${orgName}.\nName: \nRole: \nYears at company: \n\nThank them for their contributions.`,
  },
  {
    id: "achievement",
    label: "Achievement",
    description: "Congratulate a team or individual milestone.",
    Icon: TrophyIcon,
    defaultPrompt: (orgName) =>
      `Create an achievement/congratulations post from ${orgName}.\nWho/what achieved: \nThe achievement: \n\nCelebrate the milestone.`,
  },
  {
    id: "event",
    label: "Event",
    description: "An announcement graphic for an upcoming event.",
    Icon: CalendarIcon,
    defaultPrompt: (orgName) =>
      `Create an event announcement post for ${orgName}.\nEvent name: \nDate: \nLocation: \n\nInvite people to attend.`,
  },
  {
    id: "generalPost",
    label: "General Post",
    description: "A general company update or announcement.",
    Icon: MegaphoneIcon,
    defaultPrompt: (orgName) => `Create a general company update post for ${orgName}.\nTopic: \n\nKeep it clear and on-brand.`,
  },
];

export function contentTypeById(id: string): ContentType | undefined {
  return CONTENT_TYPES.find((type) => type.id === id);
}
