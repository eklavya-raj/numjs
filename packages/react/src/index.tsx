import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { init, np } from '@webwasm/numjs-core';
import type { NumArray } from '@webwasm/numjs-core';

// ── Context ──────────────────────────────────────────────────────────────────

export interface NpContextValue {
  /** The np namespace — safe to call once ready is true */
  np: typeof np;
  /** True after the WASM module has been loaded and initialised */
  ready: boolean;
  /** Set if WASM initialisation failed */
  error: Error | null;
}

const NpContext = createContext<NpContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export interface NpProviderProps {
  children: ReactNode;
  /** Optional fallback rendered while WASM is loading */
  fallback?: ReactNode;
}

/**
 * Initialises the WASM module and makes `np` available via `useNp()`.
 *
 * @example
 * import { NpProvider } from '@webwasm/numjs-react';
 *
 * function App() {
 *   return (
 *     <NpProvider fallback={<p>Loading…</p>}>
 *       <MyComponent />
 *     </NpProvider>
 *   );
 * }
 */
export function NpProvider({ children, fallback = null }: NpProviderProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    init()
      .then(() => setReady(true))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e : new Error(String(e)))
      );
  }, []);

  return (
    <NpContext.Provider value={{ np, ready, error }}>
      {ready ? children : fallback}
    </NpContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the `np` namespace and WASM readiness state.
 * Must be used inside a `<NpProvider>`.
 *
 * @example
 * import { useNp } from '@webwasm/numjs-react';
 *
 * function MyComponent() {
 *   const { np, ready } = useNp();
 *   if (!ready) return <p>Loading…</p>;
 *   const a = np.zeros([3, 3]);
 *   return <pre>{JSON.stringify(np.toArray(a))}</pre>;
 * }
 */
export function useNp(): NpContextValue {
  const ctx = useContext(NpContext);
  if (!ctx) {
    throw new Error('useNp() must be used inside a <NpProvider>');
  }
  return ctx;
}

export type { NumArray };
