# ulyssegagne.com

Ulysse Gagné's personal website: a folder of Markdown files, turned into web pages by [Astro](https://astro.build) and published on GitHub Pages at [ulyssegagne.com](https://ulyssegagne.com).

## Where pages live

The whole site is the folder `site/`. Each `.md` file is a page, at the address of its path:

- `site/index.md` is the welcome page, ulyssegagne.com: the site's two sections, as links.
- `site/a-propos.md` is ulyssegagne.com/a-propos (« À propos »), and the pages it links to sit in the folder of the same name: `site/a-propos/hide-and-stalk.md` is ulyssegagne.com/a-propos/hide-and-stalk.
- `site/tuteur.md` is ulyssegagne.com/tuteur.

The path at the top of each page shows these levels, each part a link up: `ulyssegagne.com / a-propos / hide-and-stalk`.

An address with a slash at the end, `ulyssegagne.com/tuteur/`, lands on the same page: GitHub Pages answers it with the 404 page, whose script in the `<head>` hides the page and goes to the address without the slash (`src/pages/404.astro`). It does the same for a page that moved: its old address goes to the new one. The real addresses stay without a slash, served as they are, with no redirect.

Every element a page can use, with the Markdown that makes it: `site/guide-de-style.md`, at ulyssegagne.com/guide-de-style (hidden from search engines).

## Add a page

1. Create a `.md` file in `site/`, named as its address should read: lowercase, hyphens, no spaces. `site/a-propos/one-line.md` becomes ulyssegagne.com/a-propos/one-line.
2. Start it with its properties:

   ```md
   ---
   title: one-line
   description: Le plus long parcours de course dans un quartier, sans jamais reprendre la même rue.
   date: 2026-03-01
   ---
   ```

   `title` is the page's title. `description` doesn't show on the page: search engines and link previews use it. Any other property (`date`, `lieu`, `avec`…) shows as a fact under the title; a web address or an email shows as a link. `photo: ./images/ulysse-gagne.jpg` puts a photo above the title, cropped square, and makes it the page's image in link previews. `noindex: true` keeps a page out of search engines.
3. Write the page in plain Markdown, with ordinary spaces: the site keeps « », : and numbers like 7 300 from breaking across lines.
4. Link to it from another page: `[[one-line]]`, as in Documents, which keeps working if the page moves, or `[one-line](/a-propos/one-line)`. A link to another site, `[Claude Code](https://claude.com/product/claude-code)`, opens in a new tab on its own.

## Move a page

1. Move its file, with git: `git mv site/course.md site/a-propos/course.md`.
2. Add its old address to `src/moved.ts`, `'/course': '/a-propos/course'`: the 404 page sends the old address on, so links to it from elsewhere keep working.
3. Links written `[[course]]` follow the file on their own; links written with the address, `[…](/course)`, take the new one.

## Add an image

1. Put the file in `site/images/`, with a plain name: `one-line-1-map.png`.
2. Write it where it goes: `![[one-line-1-map.png]]`, as Obsidian does, or with its path from the page and a description, `![What it shows](./images/one-line-1-map.png)` (`../images/…` from a page in `site/a-propos/`).
3. If you want a caption, an italic line right under the image, its file name: `*one-line-1-map.png*`. Several images on one line sit side by side.

No need to shrink images first: each one is made light (WebP) when the site is built.

## In Obsidian

- Links work as in Documents: `[[tuteur]]` is the page named `tuteur.md` anywhere in `site/`, shown with its title; `[[tuteur|other words]]` shows other words; `![[photo.jpg]]` is an image anywhere in `site/`. A name that matches no file shows as plain text, and the build prints a warning. Callouts, folds and `==highlights==` work too.
- A note for yourself: `<!-- like this -->`, hidden on the page. Obsidian's `%% comments %%` would show.
- Everything in `site/` is public, notes included: the repository is public.

## Preview

```bash
npm install     # once, and after package.json changes
npm run dev     # http://localhost:4321, updates as you save
```

## Publish

Every push to `main` goes online 4 to 10 minutes later (`.github/workflows/deploy.yml`). Work in small steps, each one online as soon as it's done:

```bash
npm run build          # must end without errors
git add -A
git commit -m "What changed"
git pull --rebase      # other sessions push to main too
git push               # never --force
```

Then check that the deploy went through (the repository's Actions tab; one that times out on GitHub's side goes again with `gh run rerun <id> --failed`) and reload the page: a browser keeps a page for 10 minutes, so hard-reload it (Cmd+Shift+R) or add `?x=1` to its address. Several sessions can work on the site at once: each one touches only its own pages. A pull request is still built before it's merged, when a change needs a check first.

## The code

- `src/content.config.ts`: `site/` as a collection of pages.
- `src/pages/[...slug].astro`: one HTML file per page. `src/layouts/Base.astro`: the path at the top (`ulyssegagne.com/` on the welcome page, `ulyssegagne.com / a-propos / course` on the others), and the tags for search engines and link previews.
- `src/styles/global.css`: the design system.
- `src/plugins/`: Obsidian's extras, French spacing, and `rehype-external-links.mjs`: a link to another site opens in a new tab (`target="_blank" rel="noopener noreferrer"`), in the Markdown by itself and, in a layout's own `<a>`, with `NEW_TAB` when `isOutside(href, Astro.site)`.
- `src/pages/404.astro`, with the old addresses of pages that moved in `src/moved.ts`, and `sitemap.xml.ts`; `public/`: the favicon and `robots.txt`.
