import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { createProduct, updateProduct } from "../../api/productApi";
import styles from "./ProductModal.module.css";

function ProductModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          unit: product.unit,
          reorderLevel: product.reorderLevel,
        }
      : { stock: 0, reorderLevel: 0 },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      if (isEdit) {
        await updateProduct(product._id, data);
      } else {
        await createProduct(data);
      }
      onSaved();
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not save product");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Product Name *</label>
            <input
              type="text"
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Category *</label>
            <input
              type="text"
              placeholder="e.g. Packaging"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className={styles.error}>{errors.category.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Unit *</label>
            <input
              type="text"
              placeholder="e.g. pcs, roll, pair"
              {...register("unit", { required: "Unit is required" })}
            />
            {errors.unit && (
              <p className={styles.error}>{errors.unit.message}</p>
            )}
          </div>

          {!isEdit && (
            <div className={styles.field}>
              <label>Opening Stock</label>
              <input
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
              />
              {errors.stock && (
                <p className={styles.error}>{errors.stock.message}</p>
              )}
            </div>
          )}

          <div className={styles.field}>
            <label>Reorder Level</label>
            <input
              type="number"
              {...register("reorderLevel", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            {errors.reorderLevel && (
              <p className={styles.error}>{errors.reorderLevel.message}</p>
            )}
          </div>

          {serverError && <p className={styles.error}>{serverError}</p>}

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
