# @webwasm/numjs-core

> NumPy-compatible numerical computing for JavaScript & TypeScript. Powered by Rust + WebAssembly.

```bash
npm install @webwasm/numjs-core
```

```ts
import { init, np } from '@webwasm/numjs-core';

await init();

const a = np.array([1, 2, 3, 4], [2, 2]);
const b = np.ones([2, 2]);

np.add(a, b);        // element-wise
np.mul(a, 3);        // scalar broadcast
np.dot(a, b);        // matrix multiply

np.arange(5);        // [0, 1, 2, 3, 4]
np.linspace(0, 1);   // 50 evenly spaced points
```

Using React? Check out [`@webwasm/numjs-react`](https://www.npmjs.com/package/@webwasm/numjs-react).

Full docs, roadmap, and an interactive Storybook playground: **https://github.com/eklavya-raj/numjs**
