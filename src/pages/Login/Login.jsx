import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

import api from "../../api/axios";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Cannot connect to server",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Truck size={32} />
          <span>LogiStock</span>
        </div>
        <p className={styles.subtitle}>Warehouse &amp; Supply Management</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@logi.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {loginError && <p className={styles.error}>{loginError}</p>}

          <button type="submit" className={styles.submitBtn}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
