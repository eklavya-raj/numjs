import type { Meta, StoryObj } from '@storybook/react';
import { WasmDemo } from './WasmDemo';
import { np } from '@webwasm/numjs-core';

const hidden = { table: { disable: true } } as const;
const textControl = (desc: string) => ({ control: 'text', description: desc } as const);

const meta: Meta<typeof WasmDemo> = {
  title: 'numJS/Array Creation',
  component: WasmDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Functions for creating `NdArray` instances. Edit parameters in the **Controls** panel or inline fields, then press **▶ Run** (or Enter).',
      },
    },
  },
  argTypes: {
    fn:         hidden,
    signature:  hidden,
    description: hidden,
    paramDefs:  hidden,
    run:        hidden,
    p0: textControl('First parameter (JSON)'),
    p1: textControl('Second parameter (JSON)'),
    p2: textControl('Third parameter (JSON)'),
    p3: hidden,
  },
};

export default meta;
type Story = StoryObj<typeof WasmDemo>;

export const NpArray: Story = {
  name: 'np.array',
  args: {
    fn: 'np.array',
    signature: 'array(data: number[], shape?: number[]): NdArray',
    description: 'Create an NdArray from a flat number array and an optional shape. If shape is omitted the array is 1-D.',
    p0: '[1,2,3,4,5,6]',
    p1: '[2,3]',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
    ],
    run: ([data, shape]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      return { shape: a.shape(), ndim: a.ndim(), size: a.size(), dtype: a.dtype(), data: np.toArray(a) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};

export const NpZeros: Story = {
  name: 'np.zeros',
  args: {
    fn: 'np.zeros',
    signature: 'zeros(shape: number[]): NdArray',
    description: 'Create an array of zeros with the given shape.',
    p0: '[3,3]',
    paramDefs: [{ label: 'shape', type: 'number[]' }],
    run: ([shape]: unknown[]) => {
      const a = np.zeros(shape as number[]);
      return { shape: a.shape(), size: a.size(), data: np.toArray(a) };
    },
  },
  argTypes: { p1: hidden, p2: hidden, p3: hidden },
};

export const NpOnes: Story = {
  name: 'np.ones',
  args: {
    fn: 'np.ones',
    signature: 'ones(shape: number[]): NdArray',
    description: 'Create an array of ones with the given shape.',
    p0: '[2,4]',
    paramDefs: [{ label: 'shape', type: 'number[]' }],
    run: ([shape]: unknown[]) => {
      const a = np.ones(shape as number[]);
      return { shape: a.shape(), size: a.size(), data: np.toArray(a) };
    },
  },
  argTypes: { p1: hidden, p2: hidden, p3: hidden },
};

export const NpArange: Story = {
  name: 'np.arange',
  args: {
    fn: 'np.arange',
    signature: 'arange(start: number, stop: number, step?: number): NdArray',
    description: "Create a 1-D array with evenly spaced values in [start, stop). Similar to Python's range().",
    p0: '0',
    p1: '10',
    p2: '2',
    paramDefs: [
      { label: 'start', type: 'number' },
      { label: 'stop',  type: 'number' },
      { label: 'step',  type: 'number' },
    ],
    run: ([start, stop, step]: unknown[]) => {
      const a = np.arange(start as number, stop as number, step as number);
      return { shape: a.shape(), data: np.toArray(a) };
    },
  },
  argTypes: { p3: hidden },
};

export const NpLinspace: Story = {
  name: 'np.linspace',
  args: {
    fn: 'np.linspace',
    signature: 'linspace(start: number, stop: number, num: number): NdArray',
    description: 'Create a 1-D array with `num` evenly spaced values in the closed interval [start, stop].',
    p0: '0',
    p1: '1',
    p2: '5',
    paramDefs: [
      { label: 'start', type: 'number' },
      { label: 'stop',  type: 'number' },
      { label: 'num',   type: 'number' },
    ],
    run: ([start, stop, num]: unknown[]) => {
      const a = np.linspace(start as number, stop as number, num as number);
      return { shape: a.shape(), data: np.toArray(a) };
    },
  },
  argTypes: { p3: hidden },
};
