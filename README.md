# @maverickchampi/components

A lightweight, typed UI component library built with React and TypeScript.

[![npm version](https://img.shields.io/npm/v/@maverickchampi/components)](https://www.npmjs.com/package/@maverickchampi/components)

## Preview

You can see a live preview of the components in [https://maverickchampi-components.vercel.app/](https://maverickchampi-components.vercel.app/)

## Installation

```bash
npm install @maverickchampi/components
```

## Usage

```tsx
import { Button, Input } from "@maverickchampi/components";
import "@maverickchampi/components/dist/index.css";

function App() {
  return (
    <form>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </form>
  );
}
```

## Peer dependencies

Requires React 18 (not React 19 yet):

```json
{
  "react": ">=18",
  "react-dom": ">=18"
}
```

## License

MIT