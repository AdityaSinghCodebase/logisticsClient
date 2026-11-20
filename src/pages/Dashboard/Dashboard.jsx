import { useState, useEffect } from "react";
import { Package, Layers, ArrowDown, ArrowUp } from "lucide-react";
import { getDashboard } from "../../api/dashboardApi";
import { formatShortDate } from "../../utils/formatDate";
import StatCard from "../../components/StatCard/StatCard";
import StockChart from "../../components/StockChart/StockChart";
import LowStockTable from "../../components/LowStockTable/LowStockTable";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load dashboard"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;

  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts.toLocaleString(),
      icon: Package,
      variant: "blue",
    },
    {
      title: "Total Stock",
      value: data.totalStock.toLocaleString(),
      icon: Layers,
      variant: "purple",
    },
    {
      title: "Stock In (Today)",
      value: `+${data.stockInToday.toLocaleString()}`,
      icon: ArrowDown,
      variant: "green",
    },
    {
      title: "Stock Out (Today)",
      value: `-${data.stockOutToday.toLocaleString()}`,
      icon: ArrowUp,
      variant: "red",
    },
  ];

  const chartData = data.movement.map((d) => ({
    ...d,
    day: formatShortDate(d.date),
  }));

  return (
    <div>
      <div className={styles.statsGrid}>
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            variant={item.variant}
          />
        ))}
      </div>

      <div className={styles.row}>
        <StockChart data={chartData} />
        <LowStockTable items={data.lowStock} />
      </div>
    </div>
  );
}

export default Dashboard;
