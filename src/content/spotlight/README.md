# Spotlight posts

Posts are edited in Keystatic at `/keystatic`. See [docs/cms.md](../../../docs/cms.md) for the editor guide.

Each post is `<kind>/<slug>.mdx`: the folder (`recap`, `in-the-works`, `coming-up`, `member`) sets the kind and the file name sets the URL, `/spotlight/<slug>`. Slugs must be unique across all four folders. The frontmatter is checked by `src/data/models/spotlightSchema.ts` at build time.
