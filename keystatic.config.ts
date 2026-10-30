import { collection, config, fields } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";
import { EVENT_CATEGORIES } from "./src/domain/entities/Event";
import { KEYSTATIC_REPO } from "./src/lib/keystatic";
import { PROJECT_STAGES, SPOTLIGHT_KINDS, type SpotlightKind } from "./src/domain/entities/SpotlightPost";

const required = { isRequired: true } as const;
const text = (label: string, description?: string) => fields.text({ label, description, validation: { length: { min: 1 } } });
const optionalText = (label: string, description?: string) => fields.text({ label, description });
const options = (values: readonly string[]) => values.map((value) => ({ label: value.replaceAll("-", " "), value }));

const spotlightImage = (label: string, description?: string, isRequired = false) =>
  fields.image({ label, description, directory: "public/images/spotlight", publicPath: "/images/spotlight/", validation: { isRequired } });

const link = fields.object({
  label: text("Label", "e.g. LinkedIn, Repo"),
  url: fields.text({
    label: "Link (https only)",
    validation: { isRequired: true, pattern: { regex: /^https:\/\/\S+$/, message: "Must start with https://" } },
  }),
});
const links = (label: string) => fields.array(link, { label, itemLabel: (p) => p.fields.label.value || "Link" });

// Every prop is a plain string: next-mdx-remote drops {…} expression props.
const contentComponents = {
  PullQuote: block({
    label: "Pull quote",
    schema: { quote: text("Quote"), attribution: optionalText("Who said it") },
  }),
  Figure: block({
    label: "Photo with caption",
    schema: {
      src: spotlightImage("Photo", "Under about 300 KB", true),
      alt: text("Alt text", "What the photo shows, for screen readers"),
      caption: optionalText("Caption"),
    },
  }),
  PhotoGallery: repeating({ label: "Photo gallery", children: ["GalleryImage"], schema: {} }),
  GalleryImage: block({
    label: "Gallery photo",
    forSpecificLocations: true,
    schema: {
      src: spotlightImage("Photo", "Under about 300 KB", true),
      alt: text("Alt text", "What the photo shows, for screen readers"),
    },
  }),
  Callout: wrapper({
    label: "Callout box",
    schema: { title: optionalText("Heading") },
  }),
};

const KIND_LABEL: Record<SpotlightKind, string> = {
  recap: "Spotlight: Recaps",
  "in-the-works": "Spotlight: In the works",
  "coming-up": "Spotlight: Coming up",
  member: "Spotlight: Members",
};

const memberFields = {
  member: fields.object(
    {
      name: text("Name"),
      degree: text("Degree", "e.g. BBIT"),
      year: text("Year", "e.g. Year 3 or Class of 2024"),
      quote: text("Quote", "With their permission"),
      photo: spotlightImage("Portrait"),
      photoAlt: optionalText("Portrait alt text", "Required when a portrait is set"),
      links: links("Links"),
    },
    { label: "Member" },
  ),
};

const projectFields = {
  project: fields.object(
    {
      stage: fields.select({ label: "Stage", options: options(PROJECT_STAGES), defaultValue: "building" }),
      team: fields.array(text("Name"), { label: "Team", itemLabel: (p) => p.value || "Name" }),
      links: links("Links"),
    },
    { label: "Project status box" },
  ),
};

const kindFields = {
  recap: {},
  "in-the-works": projectFields,
  "coming-up": {
    eventSlug: fields.relationship({ label: "Event", description: "Shows the event card with Add to Calendar", collection: "events" }),
  },
  member: memberFields,
};

const spotlightCollection = (kind: SpotlightKind) =>
  collection({
    label: KIND_LABEL[kind],
    path: `src/content/spotlight/${kind}/*`,
    slugField: "title",
    format: { contentField: "body" },
    entryLayout: "content",
    columns: ["title", "date"],
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: { label: "URL", description: "The post lives at /spotlight/<url>. Must not match a post in another Spotlight section." },
      }),
      date: fields.datetime({ label: "Publish date (Nairobi time)", validation: required }),
      dek: text("Standfirst", "One sentence shown under the title"),
      excerpt: text("Excerpt", "One or two lines shown in the feed"),
      author: text("Author"),
      coverImage: spotlightImage("Cover photo", "Under about 300 KB, around 1600 px wide"),
      coverAlt: optionalText("Cover alt text", "Required when a cover photo is set"),
      ...kindFields[kind],
      gallery: fields.array(
        fields.object({
          image: spotlightImage("Photo", "Under about 300 KB", true),
          alt: text("Alt text", "What the photo shows, for screen readers"),
        }),
        { label: "Photos after the article", itemLabel: (p) => p.fields.alt.value || "Photo" },
      ),
      draft: fields.checkbox({ label: "Draft", description: "Keep this post off the live site" }),
      body: fields.mdx({
        label: "Article",
        options: { image: { directory: "public/images/spotlight", publicPath: "/images/spotlight/" } },
        components: contentComponents,
      }),
    },
  });

export default config({
  storage:
    process.env.NODE_ENV === "production"
      ? { kind: "github", repo: KEYSTATIC_REPO, branchPrefix: "content/" }
      : { kind: "local" },
  ui: { brand: { name: "SCESA" } },
  collections: {
    ...Object.fromEntries(SPOTLIGHT_KINDS.map((kind) => [`spotlight-${kind}`, spotlightCollection(kind)])),
    events: collection({
      label: "Events",
      path: "src/content/events/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" }, slug: { label: "URL", description: "The event lives at /events/<url>" } }),
        category: fields.select({ label: "Category", options: options(EVENT_CATEGORIES), defaultValue: "workshop" }),
        date: fields.datetime({ label: "Starts (Nairobi time)", validation: required }),
        endDate: fields.datetime({ label: "Ends (Nairobi time)", validation: required }),
        venue: optionalText("Venue", "Venue or online link is required"),
        virtualUrl: fields.url({ label: "Online link" }),
        speaker: text("Speaker"),
        community: text("Host community"),
        image: fields.image({
          label: "Poster",
          description: "Under about 300 KB",
          directory: "public/images/events",
          publicPath: "/images/events/",
          validation: required,
        }),
        imageAlt: text("Poster alt text", "What the poster shows, for screen readers"),
        excerpt: text("Excerpt", "One or two lines shown on the card"),
        body: fields.mdx({
          label: "Description",
          options: { image: { directory: "public/images/events", publicPath: "/images/events/" } },
        }),
      },
    }),
  },
});
