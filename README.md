<div align="center">

# 🧮 numJS

### **NumPy for JavaScript. Powered by Rust + WebAssembly.**

*The fastest way to do real numerical computing in the browser and Node.js — with the API you already know.*

[![WebAssembly](https://img.shields.io/badge/WebAssembly-Powered-654FF0?logo=webassembly&logoColor=white)](https://webassembly.org/)
[![Rust](https://img.shields.io/badge/Rust-Core-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-Hooks-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

**[📖 Docs](#-api)** • **[🚀 Quick Start](#-quick-start)** • **[🎨 Storybook Playground](#-interactive-playground)** • **[🗺 Roadmap](#-roadmap)**

</div>

---

## ✨ Why numJS?

Scientific computing in JavaScript has always been a compromise — pure-JS libraries are slow, and WASM wrappers feel foreign. **numJS closes the gap**: a **NumPy-compatible API** with native-speed execution via Rust compiled to WebAssembly, plus first-class TypeScript types and React bindings.

| 🔥 Feature | numJS | Pure-JS libs |
|---|:---:|:---:|
| **Native NumPy API** (`np.zeros`, `np.arange`, `np.dot`) | ✅ | ⚠️ Partial |
| **Rust + WASM performance** | ✅ | ❌ |
| **First-class TypeScript** | ✅ | ⚠️ Varies |
| **React hooks & context** (`useNp`, `NpProvider`) | ✅ | ❌ |
| **Interactive Storybook docs** | ✅ | ❌ |
| **Zero JS deps at runtime** | ✅ | ❌ |
| **Works in Node, Browser, Bun, Deno** | ✅ | ✅ |

---

## 📦 Packages

This is a pnpm monorepo published under the `@webwasm` npm scope so framework adapters can be added without bloating the core.

| Package | Description | Status |
|---|---|:---:|
| **[`@webwasm/numjs-core`](./packages/numjs)** | TypeScript API + WASM loader — the main entry point | ✅ Stable |
| **[`@webwasm/numjs-react`](./packages/react)** | `NpProvider` + `useNp` hook for React apps | ✅ Stable |
| **[`numjs-core`](./packages/numjs-core)** | Rust crate compiled to WASM (internal) | ✅ Stable |
| **[`@webwasm/numjs-docs`](./apps/docs)** | Interactive Storybook playground | ✅ Live |
| `@webwasm/numjs-svelte` | Svelte bindings | 🚧 Planned |
| `@webwasm/numjs-vue` | Vue composables | 🚧 Planned |
| `@webwasm/numjs-angular` | Angular service | 🚧 Planned |

---

## 🚀 Quick Start

### Prerequisites
- [Rust toolchain](https://rustup.rs/) + `wasm-pack` &nbsp;`cargo install wasm-pack`
- Node.js ≥ 18 + [pnpm](https://pnpm.io/) &nbsp;`npm i -g pnpm`
- WASM target &nbsp;`rustup target add wasm32-unknown-unknown`

### Install
```bash
pnpm install     # install JS deps
pnpm build       # build WASM + TS packages
pnpm storybook   # launch the interactive playground on http://localhost:6006
```

---

## 📖 API

### Vanilla TypeScript / JavaScript

```ts
import { init, np } from '@webwasm/numjs-core';

await init();                               // load WASM once at startup

const a = np.array([1, 2, 3, 4], [2, 2]);   // shape (2,2)
const b = np.ones([2, 2]);

np.add(a, b);              // element-wise
np.mul(a, 3);              // scalar broadcast
np.dot(a, b);              // matrix multiply

np.arange(5);              // [0,1,2,3,4]          ← NumPy-compatible
np.linspace(0, 1);         // 50 evenly spaced pts ← NumPy default

const a2 = np.reshape(a, [4]);
np.sum(a2);   // 10
np.max(a2);   // 4
```

### React — `useNp` hook

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

  const m = np.arange(9).reshape(new Uint32Array([3, 3]));
  return <pre>{JSON.stringify(np.toArray(m), null, 2)}</pre>;
}
```

---

## 🎨 Interactive Playground

Every function ships with a live Storybook story — edit the parameters in the **Controls** panel and watch the WASM output update in real time.

```bash
pnpm storybook
```

Then open **http://localhost:6006** and explore:
- **Array Creation** — `array`, `zeros`, `ones`, `arange`, `linspace`
- **Arithmetic** — `add`, `sub`, `mul`, `div` (array & scalar)
- **Reshape & Indexing** — `reshape`, `flatten`, `get`, `set`
- **Dot Product** — 1-D inner product, 2-D matmul, rectangular matmul
- **Inspection & Reductions** — `shape`, `ndim`, `size`, `dtype`, `sum`, `min`, `max`

---

## 🔍 Feature Matrix

| Category | Functions |
|---|---|
| **Creation** | `np.array(data, shape?)` · `np.zeros(shape)` · `np.ones(shape)` · `np.arange(stop)` / `(start, stop)` / `(start, stop, step)` · `np.linspace(start, stop, num=50)` |
| **Inspection** | `a.shape()` · `a.ndim()` · `a.size()` · `a.dtype()` · `a.data()` |
| **Element access** | `a.get(i)` · `a.set(i, v)` |
| **Manipulation** | `np.reshape(a, shape)` · `np.ravel(a)` · `np.flatten(a)` · `a.reshape(shape)` · `a.flatten()` |
| **Arithmetic** | `np.add/sub/mul/div(a, b \| scalar)` |
| **Reductions** | `np.sum(a)` · `np.min(a)` · `np.max(a)` |
| **Linear algebra** | `np.dot(a, b)` — 1-D inner product & 2-D matmul |
| **Interop** | `np.toArray(a)` — back to nested JS arrays |

---

## 🗺 Roadmap

### ✅ v0.1 — Core foundation *(current)*
- [x] Rust `NdArray` with Float64 backend
- [x] Creation, inspection, reshape, arithmetic, reductions, dot
- [x] TypeScript wrapper with NumPy-compatible signatures (`arange`, `linspace`)
- [x] React provider + `useNp` hook
- [x] Interactive Storybook documentation
- [x] Monorepo under `@numjs` scope

### 🚧 v0.2 — Broadcasting & ergonomics
- [ ] NumPy-style broadcasting for mismatched shapes
- [ ] `np.array` accepting nested arrays (auto-shape inference)
- [ ] `axis` parameter for reductions (`sum(a, { axis: 0 })`)
- [ ] Element access via `get([i, j])` / `set([i, j], v)`
- [ ] Negative / fancy indexing, slicing (`a.slice([0, 2], [1, 3])`)
- [ ] `np.concatenate`, `np.stack`, `np.split`

### 🚧 v0.3 — Linear algebra
- [ ] `np.transpose`, `a.T`
- [ ] `np.linalg.inv`, `solve`, `det`, `eig`
- [ ] `np.matmul` (generalized), `np.einsum`
- [ ] QR / SVD / Cholesky decompositions

### 🚧 v0.4 — Numerical toolkit
- [ ] Trig + exp/log ufuncs (`np.sin`, `np.exp`, …)
- [ ] `np.random` (PRNG, normal, uniform, choice)
- [ ] `np.fft` (1-D and 2-D transforms)
- [ ] Statistics (`mean`, `std`, `var`, `median`)

### 🚧 v0.5 — Dtypes & memory
- [ ] Int32, Int64, Float32 dtypes
- [ ] Zero-copy views into existing typed arrays
- [ ] SIMD intrinsics (wasm-simd128)

### 🚧 v0.6+ — Framework ecosystem
- [ ] `@webwasm/numjs-svelte` — stores + `$np` rune
- [ ] `@webwasm/numjs-vue` — composables
- [ ] `@webwasm/numjs-angular` — injectable service
- [ ] `@webwasm/numjs-solid` — signals integration

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Your App (React/Svelte/Vue/Vanilla)     │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
     ┌─────────▼─────────┐          ┌──────────▼──────────┐
     │ @webwasm/numjs-core│         │ @webwasm/numjs-react│
     │  (TypeScript API) │◄─────────┤ (Provider + hooks)  │
     └─────────┬─────────┘          └─────────────────────┘
               │
     ┌─────────▼─────────┐
     │  numjs_core.wasm  │  ← compiled from Rust via wasm-pack
     │  (Float64 NdArray │
     │   + BLAS-like ops)│
     └───────────────────┘
```

---

## 🤝 Contributing

PRs welcome! Good first issues are tagged in the repo. The fastest way to contribute:

1. Fork and clone
2. `pnpm install && pnpm build`
3. Pick a roadmap item or file an issue
4. Add a Storybook story demonstrating the new function
5. Open a PR

---

## 📄 License

MIT © numJS contributors

---

<div align="center">

**Built with ❤️ using Rust, WebAssembly, and TypeScript.**

*If numJS saved you from a slow numerical loop, drop a ⭐ on the repo!*

</div>
