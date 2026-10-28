import type { SpotlightKind, SpotlightPost } from "@/domain/entities/SpotlightPost";

export const KIND_LABEL: Record<SpotlightKind, string> = {
  recap: "Recap",
  "in-the-works": "In the works",
  "coming-up": "Coming up",
  member: "Member spotlight",
};

export const FILTER_LABEL: Record<SpotlightKind, string> = {
  recap: "Recaps",
  "in-the-works": "In the works",
  "coming-up": "Coming up",
  member: "Members",
};

/** Underline colour per kind; decorative, since the note text already names the kind. */
export const UNDERLINE: Record<SpotlightKind, string> = {
  recap: "text-brand-accent",
  "in-the-works": "text-success",
  "coming-up": "text-info",
  member: "text-navy-400",
};

export function noteFor(post: Pick<SpotlightPost, "kind" | "member">) {
  switch (post.kind) {
    case "recap":
      return "just happened";
    case "in-the-works":
      return "cooking right now";
    case "coming-up":
      return "save the date";
    case "member":
      return `meet ${post.member?.name ?? "a member"}`;
  }
}
