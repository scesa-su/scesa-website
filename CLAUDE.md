# Project Specification & Master Guide: SCESA Web Platform

**Strathmore Computing and Engineering Students Association (SCESA)**  
**Domain:** `scesa.com`  
**Location Context:** Nairobi, Kenya  
**Design Artifacts:** Located in `./designs`

---

## 1. Core Architecture & Stack

### Technology Choices
- **Framework:** Next.js (App Router, React 19 / Server Components by default).
- **Language:** TypeScript (`strict: true`, no `any`).
- **Styling:** Tailwind CSS with CSS custom properties for tokens.
- **Animations:** Framer Motion (for stacked hero card swipe gestures, page transitions, mobile navigation).
- **Icons:** Lucide React.
- **PWA Integration:** `@ducanh2912/next-pwa` with web manifest, service worker caching, and offline support.
- **Content System:** Local Markdown/MDX with frontmatter (`gray-matter` + `@next/mdx` / `next-mdx-remote`) stored in repository for zero-cost maintenance.
- **Payments & Database:** M-Pesa STK Push (via Paystack Kenya or IntaSend API) + Google Sheets API (via Google Cloud Service Account) for automated member recording with zero recurring hosting costs.
- **Hosting Target:** Vercel (Hobby Tier: custom domain `scesa.com`, free automated SSL, edge routing).

---

## 2. Clean Architecture Layering

The codebase strictly isolates presentation, business rules, and external data sources:

```text
src/
├── app/                                 # Next.js App Router (Routing / Controllers)
│   ├── (site)/
│   │   ├── page.tsx                     # Home Page
│   │   ├── events/
│   │   │   ├── page.tsx                 # Events Directory
│   │   │   └── [slug]/page.tsx          # Single Event Detail
│   │   ├── communities/
│   │   │   ├── page.tsx                 # Communities Hub
│   │   │   └── [slug]/page.tsx          # Dedicated Community Profile
│   │   ├── spotlight/
│   │   │   └── page.tsx                 # Student & Alumni Spotlight
│   │   ├── about/
│   │   │   └── page.tsx                 # About SCESA & Leadership
│   │   └── join/
│   │       └── page.tsx                 # Member Registration & M-Pesa Checkout
│   ├── api/
│   │   ├── mpesa/
│   │   │   ├── checkout/route.ts        # STK Push initiator
│   │   │   └── webhook/route.ts         # Payment callback handler
│   │   └── register/route.ts            # Member registration handler
│   ├── manifest.ts                      # PWA Web Manifest
│   ├── layout.tsx                       # Root Layout & Font Definitions
│   └── globals.css                      # CSS Variables & Tailwind Directives
│
├── domain/                              # Pure Business Logic (No React / No Next.js)
│   ├── entities/                        # Event, Member, Community, SpotlightItem
│   ├── repositories/                    # Interfaces (IEventRepository, IMemberRepository)
│   └── usecases/                        # ProcessMembershipPayment, FetchUpcomingEvents, etc.
│
├── data/                                # Data Implementation Layer
│   ├── models/                          # DTOs and Zod validation schemas
│   ├── datasources/                     # MdxEventsDataSource, GoogleSheetsDataSource, PaymentGatewayClient
│   └── repositories/                    # Concrete implementations of Domain Repositories
│
├── presentation/                        # UI Layer
│   ├── components/
│   │   ├── ui/                          # Atoms: Button, Badge, Modal, Input, Card
│   │   ├── layout/                      # Navbar, MobileDrawer, Footer
│   │   ├── home/                        # HeroSection, SwipeableDeck, StatsSection, FeaturedEvents
│   │   ├── events/                      # EventCard, EventFilters, CalendarView
│   │   ├── communities/                 # CommunityCard, CommunityDetailView
│   │   ├── spotlight/                   # SpotlightCard, StoryModal
│   │   └── join/                        # RegistrationForm, STKModal, PaymentStatus
│   ├── hooks/                           # Custom React hooks (useSwipeGesture, useDarkMode, useSTKPush)
│   └── context/                         # ThemeContext, UIStateContext
│
├── content/                             # Markdown Content Files
│   ├── events/                          # e.g. angular-kenya-roadshow.mdx
│   ├── communities/                     # e.g. cybersecurity.mdx, ai-ml.mdx
│   └── spotlight/                       # e.g. jane-doe-internship.mdx
└── lib/                                 # Shared utilities (cn, date formats, constants)
```

---

## 3. Design System & Design Tokens (from `./designs`)

### Typography
- **Display / Headings:** `Bricolage Grotesque` (Weights: 400, 500, 600, 700)
- **Body / Text:** `Plus Jakarta Sans` (Weights: 400, 500, 600, 700)

| Token | Size | Line Height | Tracking |
| :--- | :--- | :--- | :--- |
| **Display 2xl** | 72px (4.5rem) | 90px (5.625rem) | -2% |
| **Display xl** | 60px (3.75rem) | 72px (4.5rem) | -2% |
| **Display lg** | 48px (3rem) | 60px (3.75rem) | -2% |
| **Display md** | 36px (2.25rem) | 44px (2.75rem) | -2% |
| **Display sm** | 30px (1.875rem) | 38px (2.375rem) | -2% |
| **Display xs** | 24px (1.5rem) | 32px (2rem) | 0 |
| **Text xl** | 20px (1.25rem) | 30px (1.875rem) | 0 |
| **Text lg** | 18px (1.125rem) | 28px (1.75rem) | 0 |
| **Text md** | 16px (1rem) | 24px (1.5rem) | 0 |
| **Text sm** | 14px (0.875rem) | 20px (1.25rem) | 0 |
| **Text xs** | 12px (0.75rem) | 18px (1.125rem) | 0 |

### Color Tokens

#### Base Semantic Application Tokens
| Token | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#FEFEFE` | `#1E293B` | Default page background (white, per `Home page.png`; dark matches the dark header surface, owner decision 2026-10-27) |
| **Surface** | `#FEFEFE` | `#1E293B` | Cards, navigation, overlays |
| **Primary** | `#161A51` | `#ECF3FF` | Primary headings, prominent elements |
| **Secondary** | `#A2D2FA` | `#A2D2FA` | Accent tints, icon backgrounds |
| **Accent** | `#FF7A3F` | `#FF7A3F` | CTAs, active states, key tags |
| **Border** | `#E2E8F0` | `#334155` | Card and divider borders |

#### Primary Navy Scale
- `900: #161A51` | `800: #252F8A` | `700: #242EAF` | `600: #2832DA` | `500: #3543F6`
- `400: #546EFF` | `300: #7493FF` | `200: #9CBAFF` | `100: #C1D5FF` | `50: #DDE9FF` | `25: #ECF3FF`
*(In dark mode, values invert: 900 becomes `#ECF3FF` and 25 becomes `#161A51`)*

#### Accent Orange Scale
- `900: #7E1C10` | `800: #9D1E0F` | `700: #C62408` | `600: #EF3507` | `500: #FE5011`
- `400: #FF7A3F` (Default CTA) | `300: #FFA571` | `200: #FFCAA8` | `100: #FFE6D4` | `50: #FFF4ED` | `25: #FFFDF9`

#### Neutral Slate Scale
- `900: #0F172A` | `800: #1E293B` | `700: #334155` | `600: #475569` | `500: #64748B`
- `400: #94A3B8` | `300: #CBD5E1` | `200: #E2E8F0` | `100: #F1F5F9` | `50: #F8FAFC`

#### Semantic Colors
- **Success:** Base `#22C55E` | Light `#DCFCE7`
- **Warning:** Base `#F59E0B` | Light `#FEF3C7`
- **Error:** Base `#EF4444` | Light `#FEE2E2`
- **Info:** Base `#3B82F6` | Light `#DBEAFE`

### Spacing Scale
Follows standard 4px base: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px), `20` (80px), `24` (96px), `32` (128px), `40` (160px), `48` (192px), `56` (224px), `64` (256px).

---

## 4. Git Workflow, Branching & Attribution Standards

### Branching Rules
1. `main` is strictly protected and production-only. **Direct commits to `main` are prohibited.**
2. `dev` is the continuous integration branch. All development converges here.
3. Feature, fix, and task branches are branched from `dev` and merged back into `dev` via Pull Requests.
4. When a release cycle is complete, `dev` is fast-forwarded or merged into `main`.
5. **Owner exception (2026-10-29), content PRs:** Keystatic saves edits on `content/<name>` branches and editors open a PR from Keystatic straight into `main`. This is allowed only when the PR touches nothing but `src/content/**` and `public/images/**`. The owner merges `main` back into `dev` afterwards. See `docs/cms.md`.

### Industry Branch Naming Scheme
- `feature/<short-description>` (e.g., `feature/swipeable-hero-deck`, `feature/mpesa-checkout`)
- `fix/<bug-description>` (e.g., `fix/mobile-drawer-overflow`, `fix/event-date-hydration`)
- `chore/<task-description>` (e.g., `chore/tailwind-tokens-setup`, `chore/pwa-manifest`)
- `refactor/<target>` (e.g., `refactor/clean-architecture-data-layer`)
- `docs/<subject>` (e.g., `docs/readme-setup`)

### Commit Messages (Conventional Commits)
Format: `<type>(<scope>): <short imperative message>`
- Examples:
  - `feat(home): implement framer-motion swipeable photo deck`
  - `feat(events): add mdx data layer and event card ui`
  - `fix(theme): correct dark mode surface contrast on mobile nav`
  - `chore(deps): configure pwa plugins and service workers`

### Strict Contributor & Authorship Policy
- **AI Tool Attribution Prohibition:** Claude or any AI assistant must **never** be cited or recorded as an author, co-author, committer, or contributor in:
  - Git commit authors or commit messages (`Co-authored-by: Claude` is strictly prohibited).
  - Pull Request descriptions or PR comments.
  - Code headers, JSDoc comments, or documentation files.
- All contributions, commits, and PRs must appear solely under the human developer's credentials.

### Simple Pull Request Template
Every Pull Request into `dev` or `main` must use this minimal format:

```markdown
## Summary
Concise explanation of what this PR introduces or fixes.

## Key Changes
- List change 1
- List change 2
- List change 3

## Verification
- [ ] Responsive design verified (Desktop, Tablet, Mobile)
- [ ] Dark and Light mode contrast verified (WCAG AA)
- [ ] Build passes cleanly without TypeScript or ESLint errors

## Screenshots / Video (if UI change)
[Add image or preview link here]
```

---

## 5. Page Specifications (Designed & Undesigned)

### 1. Home Page (`/`) — *Designed*
- **Hero:**
  - Left column: Headline (*"Where Strathmore's Tech Pioneers Build the Future"* in Bricolage Grotesque), subtext, primary CTA *"Find Your Tribe"* linking to `/join`.
  - Right column: **Stacked Swipeable Photo Deck** using `framer-motion` (`drag="x"`). Multiple overlapping photos of SCESA events that users can drag/flick away in a Tinder-like loop.
  - Caption: *"Swipe top photo left or right"*.
- **Mission Statement:**
  - *"The official digital home of the Strathmore Computing and Engineering Students Association. We bridge the gap between classroom theory and real-world engineering."*
- **Stats Counter:** 
  - `500+` student members | `6` dedicated communities | `4` Clubs & Sports Gala awards.
- **Featured Events Section:**
  - Cards matching `./designs` specs (Event image, title, badge, excerpt, and peach/accent button *"View Event"*).

### 2. Events Directory & Detail (`/events`, `/events/[slug]`) — *To Build*
- **Events Directory (`/events`):**
  - Filter tabs: `All`, `Upcoming`, `Workshops`, `Hackathons`, `Completed`.
  - Search bar to filter by event title, speaker, or community tag.
  - Responsive grid layout displaying `EventCard` components.
  - Empty state with clear prompt when no events match filters.
- **Event Detail Page (`/events/[slug]`):**
  - Large banner with floating status badge (`Live`, `Scheduled`, `Completed`).
  - Event metadata grid: Date & Time, Venue (or Virtual Link), Speaker details, Host Community.
  - MDX-rendered event description, schedule agenda, and prerequisites.
  - Sticky/Bottom bar with CTA button: *"RSVP / Add to Calendar"* (`.ics` generation) or external ticket link.

### 3. Communities Hub & Sub-pages (`/communities`, `/communities/[slug]`) — *To Build*
- **Communities Hub (`/communities`):**
  - Showcase the 6 active SCESA student clubs & chapters:
    1. *Angular Kenya / Web Dev Community*
    2. *Cybersecurity & CTF Club*
    3. *AI & Machine Learning Circle*
    4. *Google Developer Student Club (GDSC) Chapter*
    5. *Cloud & DevOps Guild*
    6. *Competitive Programming & Algorithms*
  - Each card features: Community logo/icon, member count, meeting frequency, short bio, and *"Explore Community"* link.
- **Dedicated Community Page (`/communities/[slug]`):**
  - Future-ready architecture allowing subdomain mapping (`angular.scesa.com` -> `/communities/angular`).
  - Community banner, mission, lead organizers/mentors with LinkedIn links.
  - Embedded list of upcoming events specific to this community.
  - Direct *"Join WhatsApp / Discord"* button.

### 4. Spotlight Page (`/spotlight`) — *To Build*
- Celebrating student achievements, startup launches, hackathon wins, and alumni career stories.
- **Layout:** Masonry or alternating editorial grid.
- **Card Content:** Student photo, student name, degree/year, company/achievement badge, quote, and read-more story modal or page.
- Direct CTA banner: *"Have an achievement to share? Submit your story."* linking to a brief form.

### 5. About & Leadership Page (`/about`) — *To Build*
- **Vision & Mission:** SCESA's pillars (Innovation, Collaboration, Industry Readiness, Excellence).
- **Executive Board & Leads:** Grid featuring executive members with name, role (President, Vice President, Tech Lead, etc.), profile photo, and social links (GitHub, LinkedIn).
- **Constitution & Code of Conduct:** Downloadable PDF or clean expandable accordion.
- **Partners & Sponsors:** Logos of industry partners, tech companies, and university departments.

### 6. Membership Registration & Checkout Flow (`/join`) — *To Build*
- **Step 1: Student Information Form:**
  - Validated with Zod: Full Name, Strathmore Student ID (`######`), Strathmore Email (`...@strathmore.edu`), Phone Number (`07XXXXXXXX` or `01XXXXXXXX` converted to `254...`), Degree Course, Year of Study.
- **Step 2: Community Interests:**
  - Multi-select pills for communities they want to join.
- **Step 3: Membership Fee Payment via M-Pesa STK Push:**
  - Display annual fee (e.g., KES 200 or as defined in constants).
  - User submits phone number -> triggers serverless API route to Paystack/IntaSend.
  - Phone receives direct STK PIN prompt.
  - Frontend displays animated polling modal: *"Please check your phone and enter your M-Pesa PIN"*.
- **Step 4: Automated Onboarding:**
  - Webhook receives successful payment notification.
  - Appends record immediately to the SCESA Membership Google Sheet via Google Cloud Service Account.
  - Success screen displays official SCESA Digital Membership Pass, downloadable receipt, and direct invite link to the private SCESA Community group.

---

## 6. Execution with Skills, Plugins & MCP Tools

To ensure code quality and token efficiency during development:
- **BMAD Workflow (`/bmad-build`):** Use the BMAD build toolchain for structured feature implementation, ensuring unit tests, story components, and schema validations are created concurrently.
- **MCP Tool Pairing:**
  - **Figma MCP / Design Context:** Inspect `./designs` snapshots directly for exact margin, padding, border radius, and typography hierarchy.
  - **GitHub MCP:** Manage branch creation, commit creation, and clean PR generation following the branch strategy.
  - **Puppeteer / Playwright MCP:** Capture local screenshots at responsive breakpoints (`375px`, `768px`, `1024px`, `1440px`) to verify visual fidelity against `./designs`.

---

## 7. Guidelines for Claude Code

1. **Autonomous File Operations:** Write and modify files directly using file edit tools. Avoid printing entire file snippets in conversation to conserve tokens.
2. **Adhere to Theming Tokens:** Never hardcode random colors (e.g. `text-blue-600` or `bg-orange-500`). Always reference configured tokens: `text-brand-primary`, `bg-brand-accent`, `bg-brand-surface`, `bg-brand-background`.
3. **Accessibility First (WCAG AA):** Ensure every button and link has proper `aria-label` attributes, keyboard navigation focus rings (`focus-visible:ring-2 focus-visible:ring-brand-accent`), and 4.5:1 text-to-background contrast in both light and dark modes.
   - **Owner exception (2026-10-27):** CTAs keep the design colours: primary Button is white on `brand-accent` (`#FF7A3F`, ~2.6:1) and card CTAs use `<Button variant="soft">` (accent text on peach). This is accepted below AA; do not "fix" it. The same applies to accent text used for emphasis alongside those CTAs (e.g. the association name in `MissionSection` is `text-brand-accent` in both themes).
4. **Resilience & Error Handling:** Wrap all serverless route handlers and external API calls (M-Pesa, Google Sheets) in `try/catch` with clear HTTP status codes and user-friendly error messages.
