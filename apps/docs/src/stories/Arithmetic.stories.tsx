import type { Meta, StoryObj } from '@storybook/react';
import { WasmDemo } from './WasmDemo';
import { np } from '@webwasm/numjs-core';

const hidden = { table: { disable: true } } as const;
const textControl = (desc: string) => ({ control: 'text', description: desc } as const);

const meta: Meta<typeof WasmDemo> = {
  title: 'numJS/Arithmetic',
  component: WasmDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Element-wise arithmetic: `np.add`, `np.sub`, `np.mul`, `np.div`. Arrays must share the same shape, or pass a scalar as the second argument. For `b`, enter either a JSON array `[1,2,3,4]` or a plain number `3`.',
      },
    },
  },
  argTypes: {
    fn: hidden, signature: hidden, description: hidden, paramDefs: hidden, run: hidden,
    p0: textControl('a — flat data (JSON array)'),
    p1: textControl('shape (JSON array)'),
    p2: textControl('b — array or scalar (JSON)'),
    p3: hidden,
  },
};

export default meta;
type Story = StoryObj<typeof WasmDemo>;

export const Add: Story = {
  name: 'np.add',
  args: {
    fn: 'np.add',
    signature: 'add(a: NdArray, b: NdArray | number): NdArray',
    description: 'Element-wise addition. Enter a JSON array or a plain number for `b`.',
    p0: '[1,2,3,4]', p1: '[2,2]', p2: '[10,20,30,40]',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'shape',    type: 'number[]' },
      { label: 'b',        type: 'number[] | number' },
    ],
    run: ([flat, shape, b]: unknown[]) => {
      const a = np.array(flat as number[], shape as number[]);
      const result = typeof b === 'number'
        ? np.add(a, b)
        : np.add(a, np.array(b as number[], shape as number[]));
      return { shape: result.shape(), result: np.toArray(result) };
    },
  },
  argTypes: { p3: hidden },
};

export const Sub: Story = {
  name: 'np.sub',
  args: {
    fn: 'np.sub',
    signature: 'sub(a: NdArray, b: NdArray | number): NdArray',
    description: 'Element-wise subtraction.',
    p0: '[10,20,30,40]', p1: '[2,2]', p2: '[1,2,3,4]',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'shape',    type: 'number[]' },
      { label: 'b',        type: 'number[] | number' },
    ],
    run: ([flat, shape, b]: unknown[]) => {
      const a = np.array(flat as number[], shape as number[]);
      const result = typeof b === 'number'
        ? np.sub(a, b)
        : np.sub(a, np.array(b as number[], shape as number[]));
      return { shape: result.shape(), result: np.toArray(result) };
    },
  },
  argTypes: { p3: hidden },
};

export const Mul: Story = {
  name: 'np.mul',
  args: {
    fn: 'np.mul',
    signature: 'mul(a: NdArray, b: NdArray | number): NdArray',
    description: 'Element-wise multiply. Enter a scalar like `3` to scale every element.',
    p0: '[1,2,3,4]', p1: '[2,2]', p2: '3',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'shape',    type: 'number[]' },
      { label: 'b',        type: 'number[] | number' },
    ],
    run: ([flat, shape, b]: unknown[]) => {
      const a = np.array(flat as number[], shape as number[]);
      const result = typeof b === 'number'
        ? np.mul(a, b)
        : np.mul(a, np.array(b as number[], shape as number[]));
      return { shape: result.shape(), result: np.toArray(result) };
    },
  },
  argTypes: { p3: hidden },
};

export const Div: Story = {
  name: 'np.div',
  args: {
    fn: 'np.div',
    signature: 'div(a: NdArray, b: NdArray | number): NdArray',
    description: 'Element-wise division.',
    p0: '[10,20,30,40]', p1: '[2,2]', p2: '10',
    paramDefs: [
      { label: 'a (flat)', type: 'number[]' },
      { label: 'shape',    type: 'number[]' },
      { label: 'b',        type: 'number[] | number' },
    ],
    run: ([flat, shape, b]: unknown[]) => {
      const a = np.array(flat as number[], shape as number[]);
      const result = typeof b === 'number'
        ? np.div(a, b)
        : np.div(a, np.array(b as number[], shape as number[]));
      return { shape: result.shape(), result: np.toArray(result) };
    },
  },
  argTypes: { p3: hidden },
};
