import type { Meta, StoryObj } from '@storybook/react';
import { WasmDemo } from './WasmDemo';
import { np } from '@webwasm/numjs-core';

const hidden = { table: { disable: true } } as const;
const textControl = (desc: string) => ({ control: 'text', description: desc } as const);

const meta: Meta<typeof WasmDemo> = {
  title: 'numJS/Dot Product',
  component: WasmDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`np.dot(a, b)` — 1-D inner product or 2-D matrix multiply. Inner dimensions must match for 2-D.',
      },
    },
  },
  argTypes: {
    fn: hidden, signature: hidden, description: hidden, paramDefs: hidden, run: hidden,
    p0: textControl('First parameter (JSON)'),
    p1: textControl('Second parameter (JSON)'),
    p2: textControl('Third parameter (JSON)'),
    p3: textControl('Fourth parameter (JSON)'),
  },
};

export default meta;
type Story = StoryObj<typeof WasmDemo>;

export const Dot1D: Story = {
  name: 'dot — 1-D inner product',
  args: {
    fn: 'np.dot',
    signature: 'dot(a: NdArray, b: NdArray): NdArray',
    description: 'Inner product of two equal-length 1-D arrays.',
    p0: '[1,2,3]', p1: '[4,5,6]',
    paramDefs: [
      { label: 'a', type: 'number[]' },
      { label: 'b', type: 'number[]' },
    ],
    run: ([a, b]: unknown[]) => {
      const va = np.array(a as number[]);
      const vb = np.array(b as number[]);
      return { result: np.toArray(np.dot(va, vb)) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};

export const Dot2D: Story = {
  name: 'dot — 2-D matmul',
  args: {
    fn: 'np.dot',
    signature: 'dot(a: NdArray [m×k], b: NdArray [k×n]): NdArray [m×n]',
    description: 'Matrix multiplication. a.shape[1] must equal b.shape[0].',
    p0: '[1,2,3,4]', p1: '[2,2]', p2: '[5,6,7,8]', p3: '[2,2]',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'a shape',  type: 'number[]' },
      { label: 'b (flat)', type: 'number[]' },
      { label: 'b shape',  type: 'number[]' },
    ],
    run: ([af, as_, bf, bs]: unknown[]) => {
      const a = np.array(af as number[], as_ as number[]);
      const b = np.array(bf as number[], bs as number[]);
      const c = np.dot(a, b);
      return { shape: c.shape(), result: np.toArray(c) };
    },
  },
};

export const DotRect: Story = {
  name: 'dot — rectangular',
  args: {
    fn: 'np.dot',
    signature: 'dot(a: NdArray [m×k], b: NdArray [k×n]): NdArray [m×n]',
    description: "Rectangular matmul — a's columns must equal b's rows.",
    p0: '[1,2,3,4,5,6]', p1: '[2,3]', p2: '[7,8,9,10,11,12]', p3: '[3,2]',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'a shape',  type: 'number[]' },
      { label: 'b (flat)', type: 'number[]' },
      { label: 'b shape',  type: 'number[]' },
    ],
    run: ([af, as_, bf, bs]: unknown[]) => {
      const a = np.array(af as number[], as_ as number[]);
      const b = np.array(bf as number[], bs as number[]);
      const c = np.dot(a, b);
      return { shape: c.shape(), result: np.toArray(c) };
    },
  },
};
