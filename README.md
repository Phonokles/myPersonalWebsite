# My Personal Website

My portfolio site — built from scratch with plain HTML, CSS and JavaScript. No frameworks, no build step, no AI-generated code. Just files.

**Live demo:** [my-personal-website-mu-puce.vercel.app](https://my-personal-website-mu-puce.vercel.app/)

## How it works

The whole site is one page with a horizontal slider. On the left there's a white panel — hover over it and it expands, then you can flip through five pages using the **scroll wheel**, the **arrow keys** or **WASD**:

1. **Welcome** — the start page
2. **About me** — with a live age counter that ticks up in real time (10 decimal places)
3. **My interests** — hover over an interest to open its page:
   - **Programming** — a file explorer that loads this repo live from the GitHub API, with syntax highlighting
   - **3D Modeling** — an interactive 3D viewer (a Blender monkey, of course)
   - **Music** — favorite songs as Spotify embeds
   - **Computer Games** — with a rotating Hollow Knight model
   - **Physics & Math** — a 4D tesseract you can rotate through all six rotation planes
4. **Projects** — pulls all my repos from the GitHub API, renders their READMEs as stacked cards, and hovering a card opens a code browser for that repo
5. **Contact** — where to find me

## Tech

- **Vanilla HTML / CSS / JS** — every line hand-written
- **GitHub REST API** — the projects page and the code explorer fetch repos, file trees and file contents live at runtime
- **[highlight.js](https://highlightjs.org/)** for syntax highlighting, **[marked](https://marked.js.org/)** for rendering the README markdown
- **[model-viewer](https://modelviewer.dev/)** for the 3D models (.glb)
- **Canvas 2D** for the tesseract — 4D rotation matrices projected down to 3D, then to 2D
- Font: [Bitcount](https://fonts.google.com/specimen/Bitcount)

## Project structure

```
code/                  ← deployment root
├── index.html         ← the slider, panel and page container
├── style.css
├── footer/            ← page switching logic + dot indicator
├── pages/
│   ├── page1/         ← welcome
│   ├── aboutme/
│   ├── page2/         ← the five interest pages (each in its own iframe)
│   ├── projects/
│   └── Contact/
└── assets/            ← 3D models and SVG icons
```

Each sub-page is a standalone HTML file loaded in an iframe, so every page keeps its own CSS and JS without interfering with the others.

## Run it locally

No build step needed. Clone the repo and serve the `code/` folder with any static server, e.g. the Live Server extension in VS Code. Opening `index.html` directly via `file://` won't work because the GitHub API calls need an HTTP origin.

---

Made by [Phonokles](https://github.com/Phonokles)
