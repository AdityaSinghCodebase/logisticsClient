import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProducts } from "../../api/productApi";
import { stockOut } from "../../api/stockApi";
import styles from "./StockOut.module.css";

function StockOut() {
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const loadProducts = () =>
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setServerError("Could not load products"));

  useEffect(() => {
    loadProducts();
  }, []);

  const selectedId = watch("product");
  const selectedProduct = products.find((p) => p._id === selectedId);

  const onSubmit = async (data) => {
    try {
      setSuccess("");
      setServerError("");

      await stockOut({
        productId: data.product,
        quantity: data.quantity,
        department: data.department,
        notes: data.notes,
      });

      setSuccess(`Issued ${data.quantity} of ${selectedProduct?.name}`);
      reset();
      loadProducts();
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not issue stock");
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Stock Out (Issue / Dispatch)</h2>

      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label>Product *</label>
          <select
            {...register("product", { required: "Please select a product" })}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className={styles.available}>
              Available stock: <strong>{selectedProduct.stock}</strong>{" "}
              {selectedProduct.unit}
            </p>
          )}
          {errors.product && (
            <p className={styles.error}>{errors.product.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Quantity *</label>
          <input
            type="number"
            placeholder="e.g. 50"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
              validate: (value) => {
                const item = products.find(
                  (p) => p._id === getValues("product"),
                );
                if (item && Number(value) > item.stock) {
                  return `Only ${item.stock} available in stock`;
                }
                return true;
              },
            })}
          />
          {errors.quantity && (
            <p className={styles.error}>{errors.quantity.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Issue To / Department *</label>
          <input
            type="text"
            placeholder="e.g. Operations"
            {...register("department", { required: "Department is required" })}
          />
          {errors.department && (
            <p className={styles.error}>{errors.department.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Notes</label>
          <textarea
            rows="3"
            placeholder="e.g. For monthly packing"
            {...register("notes")}
          />
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => reset()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Add Stock Out"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StockOut;
