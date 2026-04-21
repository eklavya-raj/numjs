use wasm_bindgen::prelude::*;
use js_sys::{Array, Float64Array};

/// A multidimensional array backed by a flat Vec<f64>.
#[wasm_bindgen]
pub struct NdArray {
    pub(crate) data: Vec<f64>,
    pub(crate) shape: Vec<usize>,
}

#[wasm_bindgen]
impl NdArray {
    // ── Constructors ──────────────────────────────────────────────────────────

    /// Create an NdArray from a flat JS Float64Array and a shape array.
    #[wasm_bindgen(constructor)]
    pub fn new(data: Float64Array, shape: Vec<usize>) -> Result<NdArray, JsValue> {
        let data: Vec<f64> = data.to_vec();
        let total: usize = shape.iter().product();
        if total != data.len() {
            return Err(JsValue::from_str(&format!(
                "Shape {:?} requires {} elements but got {}",
                shape, total, data.len()
            )));
        }
        Ok(NdArray { data, shape })
    }

    // ── Inspection ────────────────────────────────────────────────────────────

    /// Returns the shape as a JS Array of numbers.
    pub fn shape(&self) -> Array {
        self.shape
            .iter()
            .map(|&s| JsValue::from_f64(s as f64))
            .collect()
    }

    /// Number of dimensions.
    pub fn ndim(&self) -> usize {
        self.shape.len()
    }

    /// Total number of elements.
    pub fn size(&self) -> usize {
        self.data.len()
    }

    /// Data type string — always "float64" for now.
    pub fn dtype(&self) -> String {
        "float64".to_string()
    }

    // ── Data access ───────────────────────────────────────────────────────────

    /// Returns the flat data as a Float64Array (zero-copy view).
    pub fn data(&self) -> Float64Array {
        let arr = Float64Array::new_with_length(self.data.len() as u32);
        arr.copy_from(&self.data);
        arr
    }

    /// Get a single element by flat index.
    pub fn get(&self, index: usize) -> Result<f64, JsValue> {
        self.data.get(index).copied().ok_or_else(|| {
            JsValue::from_str(&format!(
                "Index {} out of bounds for size {}",
                index,
                self.data.len()
            ))
        })
    }

    /// Set a single element by flat index.
    pub fn set(&mut self, index: usize, value: f64) -> Result<(), JsValue> {
        if index >= self.data.len() {
            return Err(JsValue::from_str(&format!(
                "Index {} out of bounds for size {}",
                index,
                self.data.len()
            )));
        }
        self.data[index] = value;
        Ok(())
    }

    // ── Reshape ───────────────────────────────────────────────────────────────

    /// Returns a new NdArray with the given shape (data is copied).
    pub fn reshape(&self, new_shape: Vec<usize>) -> Result<NdArray, JsValue> {
        let total: usize = new_shape.iter().product();
        if total != self.data.len() {
            return Err(JsValue::from_str(&format!(
                "Cannot reshape array of size {} into shape {:?}",
                self.data.len(),
                new_shape
            )));
        }
        Ok(NdArray {
            data: self.data.clone(),
            shape: new_shape,
        })
    }

    /// Returns a 1-D copy of the array.
    pub fn flatten(&self) -> NdArray {
        let len = self.data.len();
        NdArray {
            data: self.data.clone(),
            shape: vec![len],
        }
    }

    // ── Reductions ────────────────────────────────────────────────────────────

    pub fn sum(&self) -> f64 {
        self.data.iter().sum()
    }

    pub fn min(&self) -> f64 {
        self.data.iter().cloned().fold(f64::INFINITY, f64::min)
    }

    pub fn max(&self) -> f64 {
        self.data.iter().cloned().fold(f64::NEG_INFINITY, f64::max)
    }

    // ── Element-wise arithmetic ───────────────────────────────────────────────

    pub fn add_array(&self, other: &NdArray) -> Result<NdArray, JsValue> {
        self.check_same_shape(other)?;
        Ok(NdArray {
            data: self.data.iter().zip(&other.data).map(|(a, b)| a + b).collect(),
            shape: self.shape.clone(),
        })
    }

    pub fn sub_array(&self, other: &NdArray) -> Result<NdArray, JsValue> {
        self.check_same_shape(other)?;
        Ok(NdArray {
            data: self.data.iter().zip(&other.data).map(|(a, b)| a - b).collect(),
            shape: self.shape.clone(),
        })
    }

    pub fn mul_array(&self, other: &NdArray) -> Result<NdArray, JsValue> {
        self.check_same_shape(other)?;
        Ok(NdArray {
            data: self.data.iter().zip(&other.data).map(|(a, b)| a * b).collect(),
            shape: self.shape.clone(),
        })
    }

    pub fn div_array(&self, other: &NdArray) -> Result<NdArray, JsValue> {
        self.check_same_shape(other)?;
        Ok(NdArray {
            data: self.data.iter().zip(&other.data).map(|(a, b)| a / b).collect(),
            shape: self.shape.clone(),
        })
    }

    pub fn add_scalar(&self, scalar: f64) -> NdArray {
        NdArray {
            data: self.data.iter().map(|a| a + scalar).collect(),
            shape: self.shape.clone(),
        }
    }

    pub fn sub_scalar(&self, scalar: f64) -> NdArray {
        NdArray {
            data: self.data.iter().map(|a| a - scalar).collect(),
            shape: self.shape.clone(),
        }
    }

    pub fn mul_scalar(&self, scalar: f64) -> NdArray {
        NdArray {
            data: self.data.iter().map(|a| a * scalar).collect(),
            shape: self.shape.clone(),
        }
    }

    pub fn div_scalar(&self, scalar: f64) -> NdArray {
        NdArray {
            data: self.data.iter().map(|a| a / scalar).collect(),
            shape: self.shape.clone(),
        }
    }

    // ── Dot product ───────────────────────────────────────────────────────────

    /// 1-D dot or 2-D matrix multiply.
    pub fn dot(&self, other: &NdArray) -> Result<NdArray, JsValue> {
        match (self.shape.as_slice(), other.shape.as_slice()) {
            // 1-D dot product → scalar stored in shape []
            ([n], [m]) if n == m => {
                let result: f64 = self.data.iter().zip(&other.data).map(|(a, b)| a * b).sum();
                Ok(NdArray { data: vec![result], shape: vec![] })
            }
            // 2-D matrix multiply
            ([r1, c1], [r2, c2]) if c1 == r2 => {
                let mut result = vec![0.0_f64; r1 * c2];
                for i in 0..*r1 {
                    for j in 0..*c2 {
                        let mut sum = 0.0;
                        for k in 0..*c1 {
                            sum += self.data[i * c1 + k] * other.data[k * c2 + j];
                        }
                        result[i * c2 + j] = sum;
                    }
                }
                Ok(NdArray { data: result, shape: vec![*r1, *c2] })
            }
            _ => Err(JsValue::from_str(&format!(
                "dot: incompatible shapes {:?} and {:?}",
                self.shape, other.shape
            ))),
        }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    fn check_same_shape(&self, other: &NdArray) -> Result<(), JsValue> {
        if self.shape != other.shape {
            Err(JsValue::from_str(&format!(
                "Shape mismatch: {:?} vs {:?}",
                self.shape, other.shape
            )))
        } else {
            Ok(())
        }
    }
}
