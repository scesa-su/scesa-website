# Editing the site with Keystatic

Spotlight posts and events are edited at **scesa.co.ke/keystatic**. You don't need to code or use git. You need a GitHub account with access to `scesa-su/scesa-website`; ask the site owner if you don't have one.

## How a change goes live

1. Open `/keystatic` and sign in with GitHub.
2. Keystatic asks you to make a branch. Give it a short name, such as `gala-recap`. It is saved as `content/gala-recap`.
3. Add or edit entries and press **Save**. Saving only changes your branch, so nothing is live yet.
4. When you are done, choose **Create pull request** in the branch menu. The pull request goes into `main`.
5. Vercel builds a preview and posts its link on the pull request. Open it and check your post.
6. The site owner reviews and merges. Your change is live a minute or two later.

The preview build checks every field. If it fails, the error names the file that has a problem. Open that entry in Keystatic, fix the field and save again. (Checks that photos and linked events exist run in `npm test`, which developers run; they don't run on your pull request.)

## Spotlight

There is one section per kind of post. The section you pick sets the layout.

- **Recaps**: something that already happened. With a cover photo, the photo runs wide across the top.
- **In the works**: something members are building now. Fill in the project status box (stage, team, links).
- **Coming up**: something announced for later. Pick the event once it exists in **Events**; the post then shows its date, place and an Add to Calendar button. After the event, write the recap as a new post in Recaps with a new URL (for example `build-weekend-recap`), and leave the coming-up post as it is or tick **Draft**. Don't reuse the coming-up post's URL or delete it: two posts can't share a URL, and deleting it can remove photos the recap uses.
- **Members**: a student or alum, their work and a quote. Name, degree, year and quote are required. Add a portrait for a profile header.

The URL field becomes the address: `gala-night` is published at `/spotlight/gala-night`. Two posts can't share a URL, even in different sections; the build fails if they do.

**Draft** keeps a post off the live site. Untick it to publish.

### Blocks in the article

Use the **+** menu in the article editor to insert:

- **Pull quote**: a large quote, with who said it.
- **Photo with caption**: one photo across the column.
- **Photo gallery**: a row of polaroid photos. Add a **Gallery photo** inside it for each picture.
- **Callout box**: a highlighted note with an optional heading.

## Events

Fill in the title, category, start and end time, speaker, host community, poster, poster alt text and excerpt. An event needs a venue, an online link, or both.

You don't set an event's status. The site works it out from the times: before the start it is **Scheduled**, between start and end it is **Live**, and after the end it is **Completed**. Pages refresh it every hour.

All times are Nairobi time (EAT). Type the time as it is in Nairobi.

## Photos

- Keep each photo under about **300 KB** and around 1600 px wide. Keystatic doesn't check the size, so shrink large photos first (for example with squoosh.app).
- Only use photos you have permission to publish.
- Always write alt text: say what the photo shows for someone who can't see it. A cover photo or portrait needs its alt text field filled in, or the build fails.

## Placeholders

Text like `[confirm: author name]` is a placeholder. Replace it with checked facts before a post goes live.

## Working on your own computer (developers)

`npm run dev`, then open `http://localhost:3000/keystatic`. In development Keystatic writes straight to the files in `src/content/` and `public/images/`, so commit them as usual. Drafts show in `npm run dev`.

Files are stored as:

- `src/content/spotlight/<kind>/<slug>.mdx`, where kind is `recap`, `in-the-works`, `coming-up` or `member`
- `src/content/events/<slug>.mdx`
- images under `public/images/spotlight/<slug>/` and `public/images/events/<slug>/`

When editing a file by hand, write dates quoted with an explicit offset, e.g. `"2026-11-14T09:00:00+03:00"`. Unquoted dates are always read as Nairobi wall time, so an unquoted `+03:00` or date-only value comes out wrong.

Every file is checked against the Zod schemas in `src/data/models/` when the site builds, and `npm test` checks that images and linked events exist.
