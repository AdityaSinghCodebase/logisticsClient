import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getTransactions } from "../../api/transactionApi";
import { formatDateTime } from "../../utils/formatDate";
import styles from "./Transactions.module.css";

const tabs = ["All", "In", "Out"];
const LIMIT = 10;

function Transactions() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getTransactions({
          type: activeTab === "All" ? undefined : activeTab,
          search: search || undefined,
          from: from || undefined,
          to: to || undefined,
          page,
          limit: LIMIT,
        });

        if (ignore) return;
        setRows(res.data.transactions);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message || "Could not load transactions",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [activeTab, search, from, to, page]);

  // Whenever a filter changes, go back to page 1
  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };
  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const changeFrom = (value) => {
    setFrom(value);
    setPage(1);
  };
  const changeTo = (value) => {
    setTo(value);
    setPage(1);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? `${styles.tab} ${styles.activeTab}`
                : styles.tab
            }
            onClick={() => changeTab(tab)}
          >
            {tab === "All" ? "All" : `Stock ${tab}`}
          </button>
        ))}
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by product, reference or user..."
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </div>

        <label className={styles.dateField}>
          From
          <input
            type="date"
            value={from}
            onChange={(e) => changeFrom(e.target.value)}
          />
        </label>

        <label className={styles.dateField}>
          To
          <input
            type="date"
            value={to}
            onChange={(e) => changeTo(e.target.value)}
          />
        </label>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date &amp; Time</th>
            <th>Type</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Reference / Dept</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className={styles.empty}>
                Loading...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan="6" className={styles.errorMsg}>
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && rows.length === 0 && (
            <tr>
              <td colSpan="6" className={styles.empty}>
                No transactions found
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            rows.map((t) => (
              <tr key={t._id}>
                <td>{formatDateTime(t.createdAt)}</td>
                <td>
                  <span
                    className={
                      t.type === "In" ? styles.badgeIn : styles.badgeOut
                    }
                  >
                    {t.type}
                  </span>
                </td>
                <td>{t.productName}</td>
                <td className={t.type === "In" ? styles.qtyIn : styles.qtyOut}>
                  {t.type === "In" ? `+${t.quantity}` : `-${t.quantity}`}
                </td>
                <td>{t.reference || t.department || "-"}</td>
                <td>{t.performedByName}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <span>{total} records</span>

        <div className={styles.pageControls}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.max(pages, 1)}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
