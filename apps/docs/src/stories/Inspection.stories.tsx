import type { Meta, StoryObj } from '@storybook/react';
import { WasmDemo } from './WasmDemo';
import { np } from '@numjs/core';

const hidden = { table: { disable: true } } as const;
const textControl = (desc: string) => ({ control: 'text', description: desc } as const);

const meta: Meta<typeof WasmDemo> = {
  title: 'numJS/Inspection & Reductions',
  component: WasmDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inspect array metadata (`shape`, `ndim`, `size`, `dtype`) and compute whole-array reductions (`sum`, `min`, `max`).',
      },
    },
  },
  argTypes: {
    fn: hidden, signature: hidden, description: hidden, paramDefs: hidden, run: hidden,
    p0: textControl('First parameter (JSON)'),
    p1: textControl('Second parameter (JSON)'),
    p2: hidden,
    p3: hidden,
  },
};

export default meta;
type Story = StoryObj<typeof WasmDemo>;

export const Metadata: Story = {
  name: 'shape / ndim / size / dtype',
  args: {
    fn: 'NdArray metadata',
    signature: '.shape(): number[]  .ndim(): number  .size(): number  .dtype(): string',
    description: 'Inspect structural properties of any NdArray.',
    p0: '[3,4]',
    paramDefs: [{ label: 'shape', type: 'number[]' }],
    run: ([shape]: unknown[]) => {
      const a = np.zeros(shape as number[]);
      return { shape: a.shape(), ndim: a.ndim(), size: a.size(), dtype: a.dtype() };
    },
  },
  argTypes: { p1: hidden, p2: hidden, p3: hidden },
};

export const Sum: Story = {
  name: 'np.sum',
  args: {
    fn: 'np.sum',
    signature: 'sum(a: NdArray): number',
    description: 'Sum of all elements.',
    p0: '[1,2,3,4,5,6,7,8,9,10]', p1: '[10]',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
    ],
    run: ([data, shape]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      return { sum: np.sum(a) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};

export const Min: Story = {
  name: 'np.min',
  args: {
    fn: 'np.min',
    signature: 'min(a: NdArray): number',
    description: 'Minimum element value across the entire array.',
    p0: '[3,1,4,1,5,9,2,6]', p1: '[8]',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
    ],
    run: ([data, shape]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      return { min: np.min(a), data: np.toArray(a) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};

export const Max: Story = {
  name: 'np.max',
  args: {
    fn: 'np.max',
    signature: 'max(a: NdArray): number',
    description: 'Maximum element value across the entire array.',
    p0: '[3,1,4,1,5,9,2,6]', p1: '[8]',
    paramDefs: [
      { label: 'data',  type: 'number[]' },
      { label: 'shape', type: 'number[]' },
    ],
    run: ([data, shape]: unknown[]) => {
      const a = np.array(data as number[], shape as number[]);
      return { max: np.max(a), data: np.toArray(a) };
    },
  },
  argTypes: { p2: hidden, p3: hidden },
};
