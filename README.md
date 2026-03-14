# Sydney TTS

PDF to audio using TTS — Electron + React + TypeScript frontend, Flask backend.

## Frontend (Electron + React + TypeScript)

### Setup

```bash
npm install
```

### Scripts

- **`npm run build`** — Build main and renderer for production
- **`npm start`** — Build and run the Electron app
- **`npm run dev`** — Build in watch mode and run Electron
- **`npm run lint`** — Run ESLint on `src`
- **`npm run lint:fix`** — Run ESLint with auto-fix
- **`npm run format`** — Format code with Prettier
- **`npm run format:check`** — Check formatting with Prettier

### Stack

- **Electron** — Desktop app
- **React 18** + **TypeScript** — UI
- **Webpack** — Bundling (main + renderer)
- **Material UI (MUI)** — Components
- **SCSS** — Styles (variables, mixins, modules)
- **ESLint** + **Prettier** — Lint and format

### Project structure

```
src/
  main/           # Electron main process
  renderer/       # React entry + index.html
  components/     # React components
  styles/         # Global SCSS, theme, variables, mixins, components
  types/          # TypeScript declarations (e.g. SCSS modules)
```
