# How to add a Spotlight post

Each post is one `.mdx` file in this folder. The file name becomes the URL, so `gala-night.mdx` is published at `/spotlight/gala-night`. Use lowercase words joined by hyphens.

You can add, edit or delete posts in the GitHub web editor. Vercel rebuilds the site when the change lands on the branch it deploys.

## Frontmatter

Start every file with this block, then write the article below it in Markdown.

```yaml
---
title: "Gala night: SCESA takes home four awards"
kind: recap            # recap, in-the-works, coming-up or member
date: "2026-06-22T18:00:00+03:00"   # publish date, with the +03:00 offset
dek: "One sentence shown under the title."
excerpt: "One or two lines shown in the feed."
author: "Your name"
coverImage: "/images/spotlight/gala-night.jpg"   # optional
coverAlt: "What the photo shows, for screen readers"   # required when coverImage is set
eventSlug: "build-weekend-hackathon"   # optional, coming-up posts: links to /events/<slug>
draft: true            # optional, see below
member:                # required when kind is member
  name: "Full name"
  degree: "BBIT"
  year: "Year 3"
  quote: "A short quote, with their permission."
  photo: "/images/spotlight/full-name.jpg"   # optional portrait
  photoAlt: "Full name smiling at the camera"  # required when photo is set
  links:               # optional, https only
    - { label: "LinkedIn", url: "https://www.linkedin.com/in/..." }
project:               # optional, in-the-works posts: the status box
  stage: building      # idea, building, testing or launched
  team: ["Name One", "Name Two"]
  links:
    - { label: "Repo", url: "https://github.com/..." }
gallery:               # optional, any kind: polaroids after the article
  - { image: "/images/spotlight/gala-1.jpg", alt: "What the photo shows" }
---
```

If a field is missing or has the wrong format, the build fails and the error names the file. `npm test` also checks that every `coverImage` file exists and every `eventSlug` matches a file in `src/content/events`.

## Kinds

Each kind has its own article layout.

- `recap`: something that already happened. With a `coverImage`, the photo runs wide across the top.
- `in-the-works`: something members are building or planning now. Add `project` to show a status box with the stage, team and links.
- `coming-up`: something announced for later. Add `eventSlug` once the event exists; the article then shows a card with the event's date, place and an Add to Calendar button. After the event, change the kind to `recap` or set `draft: true`, or the post keeps saying "save the date".
- `member`: a student or alum, their work and a quote. Add `member.photo` for a profile header with their portrait.

## Images

Put new photos in `public/images/spotlight/` and reference them from `/images/spotlight/...`. A photo already on the site (for example under `/images/home/`) can be reused as is. Keep them under about 300 KB and around 1600 px wide. Only use photos you have permission to publish, and always write `coverAlt`.

## Drafts

Add `draft: true` to keep a post off the live site. Drafts still show when you run `npm run dev`, so you can preview them. Delete the line (or set it to `false`) to publish.

## Writing tips

Use `##` for section headings inside the article. Keep paragraphs short. Write in sentence case.
