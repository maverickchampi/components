# @maverickchampi/components

UI component library by Maverick Champi.

## Stack

- React 18 (peer dependency, not installed in your consumer project)
- TypeScript
- Sass (CSS Modules) for isolated styles
- tsup to compile the library (ESM + CJS + types)
- Storybook to develop and preview components

## Install dependencies

```bash
npm install
```

## View components in development (Storybook)

```bash
npm run storybook
```

Open http://localhost:6006

## Build the library for publishing

```bash
npm run build
```

This generates the `dist/` folder with `index.js`, `index.mjs`, and `index.d.ts`.

## Publish to npm

```bash
npm login
npm run build
npm publish
```

(The `package.json` already has `"publishConfig": { "access": "public" }`, so the `@maverickchampi` scope is published publicly and for free.)

## Add a new component

1. Create the `src/components/componentName/` folder
2. Inside it: `index.tsx`, `styles.module.scss`, `index.stories.tsx`
3. Export the component in `src/index.ts`:
   ```ts
   export * from "./components/componentName";
   ```
