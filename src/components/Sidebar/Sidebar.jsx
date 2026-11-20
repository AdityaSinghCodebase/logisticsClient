import { NavLink } from "react-router-dom";
import {
  Truck,
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ChartColumn,
  Users,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "employee"],
  },
  {
    path: "/products",
    label: "Products",
    icon: Package,
    roles: ["admin", "employee"],
  },
  {
    path: "/stock-in",
    label: "Stock In",
    icon: ArrowDownToLine,
    roles: ["admin", "employee"],
  },
  {
    path: "/stock-out",
    label: "Stock Out",
    icon: ArrowUpFromLine,
    roles: ["admin", "employee"],
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    roles: ["admin", "employee"],
  },
  { path: "/reports", label: "Reports", icon: ChartColumn, roles: ["admin"] },
  { path: "/users", label: "Users", icon: Users, roles: ["admin"] },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Truck size={26} />
        <span>LogiStock</span>
      </div>

      <nav className={styles.menu}>
        {menuItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
