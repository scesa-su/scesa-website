import { CONTACT_EMAIL } from "@/lib/constants";
import { mailtoHref } from "@/lib/mailto";
import { Button } from "@/presentation/components/ui/Button";

export const STORY_MAILTO = mailtoHref({
  to: CONTACT_EMAIL,
  subject: "Spotlight story: [your name]",
  body: [
    "Name:",
    "Degree and year:",
    "",
    "What happened:",
    "",
    "Links (repo, demo, posts):",
    "",
    "Please attach any photos you have permission to share.",
  ].join("\n"),
});

export function StoryBand() {
  return (
    <section aria-labelledby="share-story" className="rounded-3xl bg-navy-25 p-8 md:p-12">
      <h2 id="share-story" className="font-display text-display-xs font-semibold text-balance text-brand-primary md:text-display-sm">
        Have something to share? Send us your story.
      </h2>
      <p className="mt-4 max-w-[60ch] text-lg text-brand-primary">
        Won something, shipped something, or know someone we should write about? Send a few lines and some photos. We
        can help with the writing.
      </p>
      <Button
        href={STORY_MAILTO}
        size="lg"
        className="mt-8"
        aria-label={`Email your story to ${CONTACT_EMAIL}`}
      >
        Email your story
      </Button>
      <p className="mt-4 text-sm text-brand-primary">
        No mail app? Copy our address: <span className="font-semibold select-all">{CONTACT_EMAIL}</span>
      </p>
    </section>
  );
}
