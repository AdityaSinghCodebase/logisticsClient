import { TriangleAlert } from "lucide-react";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>
          <TriangleAlert size={28} />
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
