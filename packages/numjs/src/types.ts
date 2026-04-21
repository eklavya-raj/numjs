/**
 * Represents a compiled NdArray instance from the WASM module.
 * This mirrors the wasm-bindgen generated NdArray class interface.
 */
export interface NumArray {
  /** Returns the shape as a number array */
  shape(): number[];
  /** Number of dimensions */
  ndim(): number;
  /** Total element count */
  size(): number;
  /** Data type string, e.g. "float64" */
  dtype(): string;
  /** Flat data as Float64Array */
  data(): Float64Array;
  /** Get element at flat index */
  get(index: number): number;
  /** Set element at flat index */
  set(index: number, value: number): void;
  /** Reshape — returns new NdArray */
  reshape(shape: Uint32Array): NumArray;
  /** Flatten to 1-D */
  flatten(): NumArray;
  /** Sum of all elements */
  sum(): number;
  /** Minimum element */
  min(): number;
  /** Maximum element */
  max(): number;
  /** Element-wise add (array) */
  add_array(other: NumArray): NumArray;
  /** Element-wise subtract (array) */
  sub_array(other: NumArray): NumArray;
  /** Element-wise multiply (array) */
  mul_array(other: NumArray): NumArray;
  /** Element-wise divide (array) */
  div_array(other: NumArray): NumArray;
  /** Add scalar */
  add_scalar(scalar: number): NumArray;
  /** Subtract scalar */
  sub_scalar(scalar: number): NumArray;
  /** Multiply scalar */
  mul_scalar(scalar: number): NumArray;
  /** Divide scalar */
  div_scalar(scalar: number): NumArray;
  /** Dot product (1-D) or matrix multiply (2-D) */
  dot(other: NumArray): NumArray;
  /** Free WASM memory */
  free(): void;
}

/** Shape expressed as a number array, e.g. [3, 4] for a 3×4 matrix */
export type Shape = number[];
