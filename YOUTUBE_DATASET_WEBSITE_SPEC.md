# YouTube Dataset Generator — Antigravity Build Specification

## 1. Project identity

**Working product name:** CommentLens

**Hero title:** Turn YouTube conversations into data.

**Hero animated word treatment:** In the hero sentence, use one important word as a rotating/blur-transition word. Example sequence:
- conversations
- comments
- insights
- data

Use a smooth blur + opacity + slight vertical motion transition. The text must not jump or reflow noticeably. Respect `prefers-reduced-motion`.

**Signature:** Crafted by Dawood Hayat

**Public contact details supplied by owner:**
- Phone: +92 329 5129250
- Email: daudhayat51@gmail.com
- LinkedIn: https://linkedin.com/in/dawoodhayat/
- GitHub: https://github.com/daud-hayat-8183

**Current GitHub repository:** https://github.com/daud-hayat-8183/youtube-sentiment-dataset

**Current Vercel domain:** https://youtube-sentiment-dataset.vercel.app/

Do not add additional personal biography, university information, address, age, semester, or other personal details unless explicitly requested.

---

## 2. Purpose

Build a polished public web application that converts a public YouTube video URL into a clean, sentiment-analysis-ready dataset.

Primary user journey:

`Paste YouTube URL → Generate Dataset → Live progress → Dataset summary → Download CSV`

Optional secondary download:

`Download Excel (.xlsx)`

The site is a university/student-built data tool, not a generic AI chatbot, not a portfolio, and not a corporate dashboard.

The product should feel like carefully crafted software with a recognizable visual signature.

---

## 3. Critical architecture rule

Do **not** deploy a pure browser-only frontend that contains the YouTube API key.

The website must use:

`Browser/UI → Vercel server-side function/API route → YouTube Data API v3`

The secret must exist only as a server-side Vercel environment variable:

`YOUTUBE_API_KEY`

Never use or expose `NEXT_PUBLIC_YOUTUBE_API_KEY`.

Never place the actual key in GitHub source code, client JavaScript, HTML, CSS, build output, browser localStorage, URL parameters, logs, or error messages.

The user's browser only sends the YouTube URL to the server-side endpoint.

---

## 4. Existing project migration

There is an existing local Python collector that already retrieves YouTube public data. Inspect and preserve useful logic before replacing anything.

Do not delete working functionality without understanding it.

The new web app should be a Vercel-friendly application, preferably Next.js + React + TypeScript + Tailwind CSS, unless inspection reveals a better compatible structure.

Existing Python code can remain as a reference or local data-collection utility, but the production website must not depend on the browser running Python.

---

## 5. YouTube API scope

Use the official YouTube Data API v3.

Public data to retrieve:

### Video metadata
- video_id
- title
- description when needed
- channel_id
- channel_name
- published_at
- category_id
- duration
- tags when available
- default language when available
- default audio language when available

### Video public statistics
- view_count
- like_count
- comment_count
- dislike_count only if the API actually returns it
- dislike_count_available

Do not claim arbitrary public dislike counts are available.

### Comments
Use `commentThreads.list` for top-level comment threads and paginate until there is no `nextPageToken`.

### Replies
For every top-level comment with replies, use `comments.list` with the proper `parentId` and paginate until there is no `nextPageToken`.

Google's current documentation states that a comment thread may not contain all replies and that `comments.list` is needed to retrieve all replies for a particular top-level comment. `commentThreads.list` and `comments.list` have a quota cost of 1 unit per call. Cite/reflect this limitation in the README, not as marketing copy. [Source: Google Developers]

Do not use browser scraping as the primary collection method.

---

## 6. Public-data limitations

The UI and README must accurately say that this tool collects publicly accessible YouTube Data API data.

Do not claim to retrieve another creator's private YouTube Studio analytics.

Do not claim to retrieve hidden personal information.

Do not promise that the YouTube reported comment count will always equal collected rows.

Deleted, moderated, unavailable, or otherwise inaccessible comments may not be retrievable.

Dislike information is generally unavailable for arbitrary public videos through the public API; only store it if the API actually returns it.

---

## 7. Core dataset rule

This is the most important data requirement:

**ONE CSV RECORD = ONE COMMENT OR ONE REPLY.**

There must be no intentional blank separator rows.

No merged cells.

No decorative rows.

No extra empty records.

No shifted columns.

Comments containing commas, quotation marks, emojis, Urdu, Arabic, Roman Urdu, accented characters, or internal newlines must remain valid CSV records.

Use a real CSV serializer. Never manually build CSV strings with `','.join(...)`.

Use UTF-8 encoding; prefer UTF-8 with BOM when necessary for Excel compatibility.

---

## 8. Primary downloadable dataset

The main user-facing file is:

`YouTube_Sentiment_Dataset_<VIDEO_ID>.csv`

Recommended columns, in this order:

1. `video_id`
2. `video_title`
3. `channel_name`
4. `comment_id`
5. `parent_comment_id`
6. `comment_type`
7. `author_display_name`
8. `author_channel_id`
9. `comment_text`
10. `cleaned_comment`
11. `comment_like_count`
12. `published_at`
13. `updated_at`

Definitions:
- `comment_type = TOP_LEVEL` for an original top-level comment.
- `comment_type = REPLY` for a reply.
- `parent_comment_id` is blank for top-level comments and contains the top-level comment ID for replies.

Do not add fake `sentiment` labels automatically.

Optionally reserve blank columns for:
- `sentiment`
- `sentiment_score`

Only populate those later if a separate labeling/ML stage explicitly requests it.

---

## 9. Data cleaning

The processed dataset should preserve the original `comment_text` and also provide `cleaned_comment`.

Cleaning must be conservative and NLP-friendly.

Do not destroy useful sentiment signals by aggressively deleting punctuation or emojis.

Do not alter the original text.

Recommended basic cleaning:
- normalize obvious whitespace
- normalize repeated line breaks
- optionally normalize HTML entities
- remove or normalize URLs only in `cleaned_comment`
- preserve Unicode
- optionally collapse repeated spaces

Keep the cleaning function modular so it can be changed later.

---

## 10. Frontend visual language

### Overall style

Complete liquid-glass / glassmorphism aesthetic with a modern, premium, bright interface.

Desired feel:
- bright
- airy
- glassy
- translucent
- premium
- youthful
- technical
- academic
- refined

Avoid:
- dark-heavy dashboard aesthetic
- generic AI landing-page styling
- robot artwork
- excessive sparkle/AI icons
- generic purple-only SaaS gradients
- overuse of cards
- giant dashboards
- visual clutter

### Background

Use a warm pearl-white/light base with slow-moving, heavily blurred gradient orbs behind the glass layers.

Suggested accent colors:
- electric blue
- soft violet
- mint
- subtle peach

Do not make the page rainbow-colored.

Use gradients as atmospheric accents rather than giant blocks.

### Glass treatment

Use translucent white surfaces with:
- backdrop blur
- very subtle border
- soft shadow
- large radius
- layered depth

Do not apply heavy blur to every element. Performance matters on mobile.

Use graceful fallbacks when backdrop-filter is unsupported.

---

## 11. Landing page structure

### Header

Minimal header.

Show:
- product logo/name: CommentLens
- compact navigation anchors such as How it works / Dataset / About
- subtle signature: Crafted by Dawood Hayat

Do not make the personal identity overpower the product.

### Hero

Primary title:

**Turn YouTube conversations into data.**

Subtitle:

**Extract comments, replies, engagement and public video data into a clean dataset built for machine learning.**

Then the main glass URL input.

Example:

`Paste a YouTube video link...`

Primary CTA:

`Generate Dataset →`

Microcopy below:

`Public YouTube data • CSV export • ML-ready`

### Word animation

In a secondary hero sentence or a designated emphasized word, use a rotating word animation where the word blurs out, changes, then sharpens into the next word.

Example:

`Turn YouTube [conversations] into data.`

Cycle:
- conversations
- comments
- insights
- data

Transition:
1. current word slightly blurs
2. opacity decreases
3. word changes
4. blur clears
5. opacity returns

Keep animation short, smooth and subtle.

Respect `prefers-reduced-motion: reduce` by disabling the animation and showing a stable word.

---

## 12. URL generator component

The input is the central visual element.

Use a large glass capsule with:
- YouTube/link icon
- input
- Generate button
- subtle focus ring
- clear error state
- valid state

Accepted URLs:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

Support normal query parameters such as `?si=...` and ignore them when extracting the ID.

Validate before making an API request.

The Generate button should be disabled until the input is non-empty and syntactically valid.

---

## 13. Loading experience

Do not show a generic spinner only.

Create a dedicated glass loading panel after submission.

Show stage-based progress:

1. Validating YouTube link
2. Fetching video information
3. Collecting comments
4. Collecting replies
5. Organizing data
6. Validating dataset
7. Generating CSV
8. Ready

Use a visually clear progress bar.

Do not fake an exact percentage when the backend does not know exact completion. Use stage progress or indeterminate progress where appropriate.

Show useful live status such as:
- comments collected
- replies collected
- total records

Example:

`Collecting comments...`
`2,840 comments processed`
`5,294 replies processed`

When exact counts are not yet available, do not invent numbers.

---

## 14. Loading sound

Include optional subtle sound feedback.

Sound must be OFF by default unless browser/user interaction permits otherwise.

Provide a small sound toggle.

After explicit user interaction, optional sounds may include:
- soft click
- subtle processing tone
- gentle completion chime

Never autoplay loud sound.

Respect reduced-motion/accessibility preferences.

Keep sound files lightweight and local to the project.

---

## 15. Success/result experience

After completion, show a polished glass result panel.

Example structure:

`✓ Dataset ready`

Video title
Channel

`4,821 top-level comments`
`9,304 replies`
`14,125 total records`

Then prominent actions:

`Download CSV`
`Download Excel`

The main CTA is Download CSV.

Filename:

`YouTube_Sentiment_Dataset_<VIDEO_ID>.csv`

Excel filename:

`YouTube_Sentiment_Dataset_<VIDEO_ID>.xlsx`

---

## 16. Dataset snapshot

Show a small analytics snapshot after generation:

- total records
- top-level comments
- replies
- average comment likes
- highest comment like count
- video views
- video likes

Keep this visual and concise.

Do not turn the homepage into a dashboard.

---

## 17. How it works section

Use four steps:

### 01 — Paste
Add a public YouTube video URL.

### 02 — Extract
Collect comments, replies, engagement and public video information.

### 03 — Organize
Normalize and validate the dataset.

### 04 — Download
Download a clean CSV ready for machine-learning analysis.

Use subtle glass cards with small icons.

---

## 18. Dataset preview section

Display a stylized, non-live sample table demonstrating the output.

Example columns:
- comment_text
- type
- likes
- published_at

Example rows can be fictional sample content.

Clearly treat it as a preview.

The preview should visually demonstrate:
- one row per record
- top-level vs reply
- parent relationship
- comment likes

---

## 19. About/credibility section

Short copy only.

Example:

`A student-built data utility designed to turn public YouTube conversations into structured datasets for NLP and sentiment-analysis workflows.`

Do not include unrequested academic/personal background.

---

## 20. Footer / personal signature

Show:

`Crafted by Dawood Hayat`

Then contact icons/links:
- Email
- LinkedIn
- GitHub
- Phone (optional, depending on visual design)

Use the supplied contact information exactly.

Do not add a map or address unless explicitly requested.

Do not add a personal biography.

---

## 21. Responsive design

Design mobile-first and test at least:
- small mobile
- large mobile
- tablet portrait
- tablet landscape
- laptop
- desktop
- wide desktop

Requirements:
- no horizontal scrolling
- URL input fits small screens
- CTA remains touch-friendly
- readable text
- safe spacing for mobile browser controls
- cards stack naturally
- glass blur does not make text unreadable
- buttons meet accessible touch target sizing

Do not merely shrink desktop layout. Reflow sections appropriately.

---

## 22. Accessibility

Implement:
- semantic HTML
- keyboard navigation
- visible focus states
- labels for inputs
- accessible button names
- sufficient contrast
- `aria-live` for collection status
- reduced motion support
- sound toggle with clear state
- meaningful error messages

Do not rely on color alone to communicate status.

---

## 23. API route/server behavior

Create a server-side endpoint for generation, such as:

`POST /api/generate`

Request body:

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Server responsibilities:
1. validate input
2. extract video ID
3. verify API key availability
4. retrieve video metadata/statistics
5. paginate top-level comments
6. paginate replies
7. normalize data
8. deduplicate by comment ID
9. validate data quality
10. create CSV
11. optionally create XLSX
12. return metadata/download information

Do not expose the raw API key.

---

## 24. Large-job architecture

Because serverless execution has limits, avoid claiming that every arbitrarily large video can finish synchronously.

For normal/small/medium videos, a server-side request can generate the dataset directly.

Design code so that a future asynchronous/background job can be added if needed.

If the collection exceeds a safe configured threshold, fail gracefully with a useful message rather than timing out silently.

Prefer configurable limits such as:
- maximum total records per request
- maximum processing time budget
- maximum concurrent jobs per IP

The default should be reasonable for a public demo.

Do not silently truncate data.

If a configurable safety cap is reached, clearly label the dataset as limited/truncated in the response and summary.

---

## 25. Rate limiting / abuse protection

Because the site is public, add reasonable server-side protection.

At minimum:
- validate URL input
- limit request body size
- rate-limit generation requests by IP or another safe mechanism
- prevent concurrent abuse
- return `429 Too Many Requests` when limits are reached
- never leak secrets in error responses

Keep implementation simple and Vercel-compatible.

If a third-party persistent rate-limit service would be required, document it instead of pretending it exists.

---

## 26. Security requirements

Never expose the API key.

Never store the API key in the database or generated CSV.

Never log the API key.

Do not include raw API error payloads in client-facing errors.

Validate YouTube URLs server-side even if client-side validation exists.

Use only expected HTTP methods and content types.

Do not execute arbitrary user input.

Set appropriate security headers where practical.

Avoid dangerously setting raw HTML from user-controlled content.

Treat downloaded comment content as untrusted text.

Do not render comment HTML as executable HTML.

---

## 27. Privacy

The website should collect only the public YouTube data necessary for the tool.

Do not collect:
- private YouTube data
- passwords
- private emails
- hidden personal information
- unrelated browser data

Do not create user accounts in the first version.

Do not retain generated datasets permanently on the server unless explicitly required.

Prefer generating the dataset for download and cleaning up temporary server-side files after a reasonable short period, depending on the implementation.

Clearly explain the privacy behavior in the Privacy section/README.

---

## 28. CSV correctness tests

Before returning a generated CSV, programmatically verify:

1. file exists
2. file is non-empty
3. header exists
4. every data record parses
5. no intentional blank rows
6. comment IDs are unique
7. no columns are shifted
8. Unicode is preserved
9. comments containing commas are valid
10. comments containing quotes are valid
11. comments with internal newlines remain valid CSV records
12. dataset can be reloaded with Pandas or an equivalent parser

If validation fails, do not give the user a download button for the invalid file.

---

## 29. Data reconciliation

Report:

`YouTube reported comment count`
vs
`Top-level comments collected`
vs
`Replies collected`
vs
`Total rows`

Do not add top-level + replies and call it equal to YouTube's comment count without qualification.

Explain differences in the report where relevant.

---

## 30. GitHub structure

Prepare the repository for clean public GitHub use.

Do not commit:
- `.env`
- real API keys
- secrets
- unnecessary generated datasets
- logs containing personal or secret information

Create a `.env.example` containing:

```text
YOUTUBE_API_KEY=
```

Create a strong `.gitignore`.

Keep source code readable.

---

## 31. Vercel deployment

The GitHub repository is:

`https://github.com/daud-hayat-8183/youtube-sentiment-dataset`

Current Vercel domain:

`https://youtube-sentiment-dataset.vercel.app/`

Configure the project for Vercel.

Add the server-side environment variable:

`YOUTUBE_API_KEY`

Set it for the environments actually used (Preview/Production as appropriate).

Redeploy after changing environment variables.

Never expose the variable to client components.

---

## 32. Performance

Optimize for:
- fast initial page load
- minimal JavaScript where possible
- lazy loading of decorative elements
- low-size assets
- no unnecessary libraries
- efficient React rendering
- no constant expensive animations
- mobile performance

Use `prefers-reduced-motion`.

Use CSS effects carefully because large-area backdrop blur can be expensive on weaker devices.

---

## 33. SEO / metadata

Create a professional page title such as:

`CommentLens — Turn YouTube Conversations into Data`

Suggested meta description:

`Generate clean, machine-learning-ready datasets from public YouTube comments, replies, engagement and video data.`

Add Open Graph/Twitter metadata where appropriate.

Use a simple favicon/brand mark.

Do not claim unsupported metrics or private analytics.

---

## 34. Error UX

Show friendly glass alert panels for:
- invalid YouTube URL
- video not found
- private/deleted video
- comments disabled
- API quota exceeded
- missing API configuration
- generation timeout
- server error
- rate limit reached

Do not show stack traces.

Give the user a clear next action, such as checking the URL or trying again later.

---

## 35. Optional reset/new video flow

After a dataset is generated, show a secondary action:

`Generate another dataset`

Clicking it should reset the form without requiring a page reload.

The user can then paste another YouTube URL and repeat the process.

---

## 36. Downloads

Primary:
`Download CSV`

Secondary:
`Download Excel`

CSV is the official ML-ready output.

Excel is a convenience copy for inspection.

Do not force users to download raw/internal/debug files.

---

## 37. Internal files vs user files

Keep internal processing data private/server-side where appropriate.

The user-facing download should be a clean dataset, not a bundle of confusing engineering files.

Do not make users download:
- logs
- JSON debug data
- internal raw API responses
- separate summary files unless explicitly requested

The application may generate internal metadata/report objects for logging/diagnostics, but they are not primary public downloads.

---

## 38. Suggested project organization

Use an understandable structure similar to:

```text
app/
  page.tsx
  api/
    generate/
      route.ts
components/
  Header.tsx
  Hero.tsx
  UrlGenerator.tsx
  ProgressPanel.tsx
  ResultPanel.tsx
  DatasetPreview.tsx
  HowItWorks.tsx
  Footer.tsx
lib/
  youtube.ts
  csv.ts
  validation.ts
  processing.ts
  rateLimit.ts
public/
  sounds/
styles/
.env.example
.gitignore
package.json
README.md
```

Adapt as needed.

Do not create unnecessary files.

---

## 39. Documentation

README must explain:

- what CommentLens does
- architecture
- Google Cloud/YouTube API setup
- environment variable setup
- local development
- GitHub workflow
- Vercel deployment
- public-data limitations
- quota considerations
- CSV schema
- security practices
- privacy behavior
- testing
- how to use the site

Also document that `commentThreads.list` may not contain all replies and `comments.list` should be used for replies. Cite Google's official API docs in documentation.

---

## 40. Testing checklist

Before declaring complete:

### Functional
- [ ] valid watch URL works
- [ ] youtu.be URL works
- [ ] shorts URL works
- [ ] URL with `?si=` works
- [ ] invalid URL rejected
- [ ] video metadata works
- [ ] public statistics work
- [ ] comments paginate
- [ ] replies paginate
- [ ] comment likes collected
- [ ] parent-child relationship correct
- [ ] CSV downloads
- [ ] Excel downloads
- [ ] another URL works without code changes

### CSV
- [ ] no blank separator rows
- [ ] no duplicate comment IDs
- [ ] no shifted columns
- [ ] commas inside comments do not break CSV
- [ ] quotes inside comments do not break CSV
- [ ] newlines inside comments do not break CSV
- [ ] emojis preserved
- [ ] Urdu/Arabic preserved
- [ ] Pandas can reload the output

### Security
- [ ] API key server-side only
- [ ] no API key in source
- [ ] no API key in browser bundle
- [ ] no API key in logs
- [ ] `.env` ignored
- [ ] `.env.example` contains blank placeholder only
- [ ] client errors do not expose secrets

### Responsive
- [ ] mobile portrait
- [ ] mobile landscape
- [ ] tablet
- [ ] laptop
- [ ] desktop
- [ ] wide desktop

### Accessibility
- [ ] keyboard usable
- [ ] focus states
- [ ] semantic headings
- [ ] input label
- [ ] status announced
- [ ] reduced motion
- [ ] sound toggle accessible

---

## 41. Definition of done

The project is complete only when all of the following are true:

1. The site looks intentionally designed, not template-generated.
2. Liquid glass is visible but restrained and performant.
3. The hero is memorable and includes the animated blur-to-new-word interaction.
4. Dawood Hayat's signature is present without unnecessary personal biography.
5. The main URL workflow is obvious.
6. Loading is visually rich and stage-based.
7. CSV output is structurally correct with one record per comment/reply and no blank separator rows.
8. The downloadable file is directly usable by Pandas for sentiment-analysis work.
9. Excel is available as a secondary convenience output.
10. The site is responsive across mobile/tablet/laptop/desktop.
11. The API key never reaches the frontend.
12. GitHub contains no secrets.
13. Vercel deployment is configured properly.
14. The same application can process another video without source-code changes.
15. Rate limiting and input validation are present.
16. Public YouTube limitations are described honestly.
17. The application has been tested locally and in the Vercel deployment.

---

## 42. Important implementation instruction to Antigravity

Do not simply produce an explanation.

Inspect the existing repository and implement the actual application.

Run the project.

Fix build errors.

Fix TypeScript errors.

Fix lint errors where relevant.

Test a real YouTube URL using the configured server-side API key without exposing the secret.

Verify that the produced CSV loads correctly.

Then deploy/push changes according to the current GitHub/Vercel integration.

Do not ask the user to manually rewrite working code when you can make the changes directly in the workspace.

If an operation requires a user-only credential or Vercel dashboard action, clearly identify that one action and continue with everything else that can be done safely.

---

## 43. Current URLs / project references

GitHub:
`https://github.com/daud-hayat-8183/youtube-sentiment-dataset`

Vercel deployment:
`https://youtube-sentiment-dataset.vercel.app/`

The user will provide the Google/YouTube API key through environment configuration. Never request the actual secret in chat or display it.
