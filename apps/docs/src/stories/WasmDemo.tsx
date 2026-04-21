import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNp } from '@numjs/react';

/** Label + type annotation for a single parameter slot (not editable via Controls) */
export interface ParamDef {
  label: string;
  type: string;
}

export interface WasmDemoProps {
  /** Function name shown as heading, e.g. "np.zeros" */
  fn: string;
  /** Full TypeScript signature */
  signature: string;
  /** Short description */
  description: string;

  // ── Flat, primitive param values — Storybook generates text controls for these ──
  /** Parameter 0 value (JSON string) */
  p0?: string;
  /** Parameter 1 value (JSON string) */
  p1?: string;
  /** Parameter 2 value (JSON string) */
  p2?: string;
  /** Parameter 3 value (JSON string) */
  p3?: string;

  /** Label + type metadata for each param slot (hidden from Controls) */
  paramDefs: ParamDef[];
  /** Called with parsed values of active params */
  run: (args: unknown[]) => unknown;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  card: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    background: '#0f172a',
    color: '#e2e8f0',
    borderRadius: 12,
    padding: '24px 28px',
    maxWidth: 620,
    boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
  },
  fnName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#38bdf8',
    marginBottom: 4,
  },
  sig: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    lineHeight: 1.6,
  },
  desc: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 16,
    lineHeight: 1.6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: 8,
  },
  paramRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  paramLabel: {
    fontSize: 13,
    color: '#e2e8f0',
    minWidth: 70,
  },
  paramType: {
    fontSize: 11,
    color: '#64748b',
    minWidth: 80,
  },
  input: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 6,
    padding: '5px 10px',
    fontSize: 13,
    color: '#f1f5f9',
    fontFamily: 'inherit',
    outline: 'none',
  },
  divider: {
    borderTop: '1px solid #1e293b',
    margin: '16px 0',
  },
  outputLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: 8,
  },
  output: {
    background: '#1e293b',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 13,
    color: '#7dd3fc',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
    minHeight: 48,
    lineHeight: 1.7,
  },
  outputError: { color: '#fca5a5' },
  outputLoading: { color: '#475569' },
  runBtn: {
    marginTop: 14,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '7px 20px',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  },
  badge: {
    display: 'inline-block',
    background: '#0c4a6e',
    color: '#38bdf8',
    borderRadius: 4,
    padding: '1px 7px',
    fontSize: 11,
    fontWeight: 600,
    marginRight: 6,
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export function WasmDemo({ fn, signature, description, p0, p1, p2, p3, paramDefs, run }: WasmDemoProps) {
  const { ready, error,np } = useNp();

  // Collect only the slots that have a paramDef entry
  const slotProps = [p0, p1, p2, p3];
  const activeCount = paramDefs.length;

  const [values, setValues] = useState<string[]>(() =>
    paramDefs.map((_, i) => slotProps[i] ?? '')
  );
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const hasRun = useRef(false);

  // Sync values when Storybook Controls update the flat props
  useEffect(() => {
    setValues(paramDefs.map((_, i) => slotProps[i] ?? ''));
    hasRun.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p0, p1, p2, p3]);

  // Surface provider-level init errors into the output box
  useEffect(() => {
    if (error) {
      setOutput(`WASM init failed: ${error.message}`);
      setIsError(true);
    }
  }, [error]);

  const execute = useCallback(
    (vals: string[]) => {
      try {
        const parsed = vals.slice(0, activeCount).map((v) => JSON.parse(v));
        const result = run(parsed);
        setOutput(JSON.stringify(result, null, 2));
        setIsError(false);
      } catch (e: unknown) {
        setOutput(String(e));
        setIsError(true);
      }
    },
    [run, activeCount]
  );

  useEffect(() => {
    if (ready && !hasRun.current) {
      hasRun.current = true;
      execute(paramDefs.map((_, i) => slotProps[i] ?? ''));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, execute]);

  const handleChange = (i: number, val: string) => {
    setValues((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  };

  const outputStyle = {
    ...S.output,
    ...(isError ? S.outputError : !ready ? S.outputLoading : {}),
  };

  useEffect(() => {
    if (ready) {
      console.log(np.arange(5, 10, 1).data());
    }
  }, [ready]);

  return (
    <div style={S.card}>
      {/* Header */}
      <div style={S.fnName}>
        <span style={S.badge}>WASM</span>
        {fn}
      </div>
      <div style={S.sig}>
        <span style={{ color: '#64748b' }}>signature  </span>
        {signature}
      </div>
      <div style={S.desc}>{description}</div>

      {/* Inputs */}
      {activeCount > 0 && (
        <>
          <div style={S.sectionLabel}>Parameters</div>
          {paramDefs.map((def, i) => (
            <div key={def.label} style={S.paramRow}>
              <span style={S.paramLabel}>{def.label}</span>
              <span style={S.paramType}>{def.type}</span>
              <input
                style={S.input}
                value={values[i] ?? ''}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && execute(values)}
                spellCheck={false}
              />
            </div>
          ))}
        </>
      )}

      <div style={S.divider} />

      {/* Output */}
      <div style={S.outputLabel}>Output</div>
      <div style={outputStyle}>{ready ? output || '…' : 'Loading WASM…'}</div>

      {ready && (
        <button style={S.runBtn} onClick={() => execute(values)}>
          ▶ Run
        </button>
      )}
    </div>
  );
}
