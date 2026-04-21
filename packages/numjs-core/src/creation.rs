use wasm_bindgen::prelude::*;
use crate::NdArray;

/// Create an array of zeros with the given shape.
#[wasm_bindgen]
pub fn zeros(shape: Vec<usize>) -> NdArray {
    let size: usize = shape.iter().product();
    NdArray { data: vec![0.0; size], shape }
}

/// Create an array of ones with the given shape.
#[wasm_bindgen]
pub fn ones(shape: Vec<usize>) -> NdArray {
    let size: usize = shape.iter().product();
    NdArray { data: vec![1.0; size], shape }
}

/// Create a 1-D array with evenly spaced values in `[start, stop)`.
///
/// Matches NumPy's flexible signature:
/// - `arange(stop)`             → start=0, step=1
/// - `arange(start, stop)`      → step=1
/// - `arange(start, stop, step)`
#[wasm_bindgen]
pub fn arange(
    a: f64,
    b: Option<f64>,
    c: Option<f64>,
) -> Result<NdArray, JsValue> {
    let (start, stop, step) = match (b, c) {
        (None, _) => (0.0, a, 1.0),
        (Some(stop), None) => (a, stop, 1.0),
        (Some(stop), Some(step)) => (a, stop, step),
    };
    if step == 0.0 {
        return Err(JsValue::from_str("arange: step cannot be zero"));
    }
    let mut data = Vec::new();
    let mut v = start;
    while (step > 0.0 && v < stop) || (step < 0.0 && v > stop) {
        data.push(v);
        v += step;
    }
    let len = data.len();
    Ok(NdArray { data, shape: vec![len] })
}

/// Create a 1-D array with `num` evenly spaced values in the closed
/// interval `[start, stop]`. `num` defaults to 50 (NumPy-compatible).
#[wasm_bindgen]
pub fn linspace(start: f64, stop: f64, num: Option<usize>) -> Result<NdArray, JsValue> {
    let num = num.unwrap_or(50);
    if num == 0 {
        return Ok(NdArray { data: vec![], shape: vec![0] });
    }
    if num == 1 {
        return Ok(NdArray { data: vec![start], shape: vec![1] });
    }
    let step = (stop - start) / (num - 1) as f64;
    let data: Vec<f64> = (0..num).map(|i| start + i as f64 * step).collect();
    Ok(NdArray { data, shape: vec![num] })
}
