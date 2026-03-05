# SagheerProjects

Portfolio website for [sagheerprojects.fun](https://sagheerprojects.fun) — built with Astro, Tailwind CSS, and pure static output for Cloudflare Pages.

## Tech Stack

- **[Astro](https://astro.build)** — static site generation, zero JS by default
- **[Tailwind CSS](https://tailwindcss.com)** — utility-first styling
- **Canvas Particles** — lightweight client-side particle background
- **No backend, no SSR, no adapters**

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:4321` in your browser.

## Build

```bash
npm run build
```

Output is written to `./dist`.

## Deploy to Cloudflare Pages

### Option 1 — Connect GitHub repo (recommended)

1. Push this repository to GitHub.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → **Create a project** → **Connect to Git**.
3. Select your repository.
4. Set the following build settings:

| Setting | Value |
|---|---|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `18` or `20` |

5. Click **Save and Deploy**.

### Option 2 — Wrangler CLI

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name sagheerprojects
```

## Project Structure

```
sagheerprojects/
├── astro.config.mjs
├── tailwind.config.cjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── _redirects
└── src/
    ├── data/
    │   └── projects.js
    ├── layouts/
    │   └── BaseLayout.astro
    ├── components/
    │   ├── Navbar.astro
    │   ├── Footer.astro
    │   └── ParticleBackground.astro
    ├── pages/
    │   ├── index.astro
    │   ├── about.astro
    │   ├── contact.astro
    │   ├── 404.astro
    │   └── projects/
    │       ├── index.astro
    │       └── [slug].astro
    └── styles/
        └── global.css
```

## Adding Projects

Edit `src/data/projects.js` and add a new object to the `projects` array:

```js
{
  slug: 'my-project',         // URL: /projects/my-project
  title: 'My Project',
  summary: 'One-line summary for cards.',
  category: 'UI/UX',          // 'UI/UX' | 'Code' | 'AI'
  tags: ['Figma', 'CSS'],
  bannerGradient: 'from-blue-900 via-indigo-900 to-violet-900',
  overview: '...',
  problem: '...',
  solution: '...',
  techStack: ['Figma', 'CSS'],
  learned: '...',
  github: 'https://github.com/...',
  live: 'https://...',
}
```

## License

MIT
