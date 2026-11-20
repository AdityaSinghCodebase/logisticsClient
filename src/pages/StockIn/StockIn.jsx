import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProducts } from "../../api/productApi";
import { stockIn } from "../../api/stockApi";
import styles from "./StockIn.module.css";

function StockIn() {
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setServerError("Could not load products"));
  }, []);

  const onSubmit = async (data) => {
    try {
      setSuccess("");
      setServerError("");

      await stockIn({
        productId: data.product,
        quantity: data.quantity,
        reference: data.reference,
        notes: data.notes,
      });

      const name = products.find((p) => p._id === data.product)?.name;
      setSuccess(`Added ${data.quantity} to ${name}`);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not add stock");
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Stock In (Receive Supplies)</h2>

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
          {errors.product && (
            <p className={styles.error}>{errors.product.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Quantity *</label>
          <input
            type="number"
            placeholder="e.g. 500"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
            })}
          />
          {errors.quantity && (
            <p className={styles.error}>{errors.quantity.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Reference / PO No. *</label>
          <input
            type="text"
            placeholder="e.g. PO-2026-017"
            {...register("reference", {
              required: "Reference number is required",
            })}
          />
          {errors.reference && (
            <p className={styles.error}>{errors.reference.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Notes</label>
          <textarea
            rows="3"
            placeholder="e.g. Received from supplier"
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
            {isSubmitting ? "Saving..." : "Add Stock In"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StockIn;
