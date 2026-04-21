# @webwasm/numjs-react

> React hooks and provider for [`@webwasm/numjs-core`](https://www.npmjs.com/package/@webwasm/numjs-core) — use NumPy-style WebAssembly arrays in your React app.

```bash
npm install @webwasm/numjs-core @webwasm/numjs-react
```

```tsx
import { NpProvider, useNp } from '@webwasm/numjs-react';

function App() {
  return (
    <NpProvider fallback={<p>Loading WASM…</p>}>
      <Matrix />
    </NpProvider>
  );
}

function Matrix() {
  const { np, ready } = useNp();
  if (!ready) return null;

  const a = np.arange(9);
  return <pre>{JSON.stringify(np.toArray(a))}</pre>;
}
```

## API

- **`<NpProvider fallback={…}>`** — initialises WASM on mount and provides the `np` namespace via context
- **`useNp()`** → `{ np, ready, error }` — access `np` and loading state from any child component

Full docs and examples: **https://github.com/eklavya-raj/numjs**
