import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { createUser, updateUser } from "../../api/userApi";
import styles from "./UserModal.module.css";

function UserModal({ user, isSelf, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          password: "",
        }
      : { role: "employee", isActive: true },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      if (isEdit) {
        await updateUser(user._id, data);
      } else {
        await createUser(data);
      }
      onSaved();
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not save user");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEdit ? "Edit User" : "Add User"}</h2>
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
            <label>Name *</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Email *</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>{isEdit ? "New Password" : "Password *"}</label>
            <input
              type="password"
              placeholder={
                isEdit ? "Leave blank to keep the current password" : ""
              }
              {...register("password", {
                validate: (value) => {
                  if (!isEdit && !value) return "Password is required";
                  if (value && value.length < 6) return "At least 6 characters";
                  return true;
                },
              })}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Role</label>
            <select {...register("role")} disabled={isSelf}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {isEdit && (
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                {...register("isActive")}
                disabled={isSelf}
              />
              Account is active
            </label>
          )}

          {isSelf && (
            <p className={styles.hint}>
              You can't change your own role or disable your own account.
            </p>
          )}

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
                  : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
