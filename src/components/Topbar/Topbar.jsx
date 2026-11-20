import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Topbar.module.css";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/stock-in": "Stock In",
  "/stock-out": "Stock Out",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/users": "Users",
};

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] || "LogiStock";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        <button className={styles.bell} aria-label="Notifications">
          <Bell size={22} />
          <span className={styles.dot}></span>
        </button>

        <div className={styles.user}>
          <CircleUser size={32} />
          <span>{user.name}</span>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
