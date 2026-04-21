import type { Meta, StoryObj } from '@storybook/react';
import { WasmDemo } from './WasmDemo';
import { np } from '@webwasm/numjs-core';

const hidden = { table: { disable: true } } as const;
const textControl = (desc: string) => ({ control: 'text', description: desc } as const);

const meta: Meta<typeof WasmDemo> = {
  title: 'numJS/Reshape & Indexing',
  component: WasmDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Array manipulation: `np.reshape`, `np.flatten`, plus element `get` / `set`.',
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

export const Reshape: Story = {
  name: 'np.reshape',
  args: {
    fn: 'np.reshape',
    signature: 'reshape(a: NdArray, shape: number[]): NdArray',
    description: 'Returns a new NdArray with the given shape. Total element count must match.',
    p0: '[1,2,3,4,5,6]', p1: '[6]', p2: '[2,3]',
    paramDefs: [
      { label: 'data',      type: 'number[]' },
      { label: 'fromShape', type: 'number[]' },
      { label: 'toShape',   type: 'number[]' },
    ],
    run: ([data, fromShape, toShape]: unknown[]) => {
      const a = np.array(data as number[], fromShape as number[]);
      const b = np.reshape(a, toShape as number[]);
      return { before: a.shape(), after: b.shape(), data: np.toArray(b) };
    },
  },
  argTypes: { p3: hidden },
};

export const Flatten: Story = {
  name: 'np.flatten',
  args: {
    fn: 'np.flatten',
    signature: 'flatten(a: NdArray): NdArray',
    description: 'Returns a 1-D copy of the array regardless of its original shape.',
    p0: '[1,2,3,4,5,6]', p1: '[2,3]',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
    ],
    run: ([data, shape]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      const b = np.flatten(a);
      return { before: a.shape(), after: b.shape(), data: np.toArray(b) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};

export const Get: Story = {
  name: 'a.get(index)',
  args: {
    fn: 'NdArray.get',
    signature: 'get(index: number): number',
    description: 'Get a single element by flat row-major index.',
    p0: '[10,20,30,40]', p1: '[2,2]', p2: '2',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
      { label: 'index', type: 'number'   },
    ],
    run: ([data, shape, index]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      return { value: a.get(index as number), fullArray: np.toArray(a) };
    },
  },
  argTypes: { p3: hidden },
};

export const Set: Story = {
  name: 'a.set(index, value)',
  args: {
    fn: 'NdArray.set',
    signature: 'set(index: number, value: number): void',
    description: 'Mutate a single element by flat row-major index.',
    p0: '[10,20,30,40]', p1: '[2,2]', p2: '1', p3: '99',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
      { label: 'index', type: 'number'   },
      { label: 'value', type: 'number'   },
    ],
    run: ([data, shape, index, value]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      const before = a.get(index as number);
      a.set(index as number, value as number);
      return { before, after: a.get(index as number), fullArray: np.toArray(a) };
    },
  },
};
