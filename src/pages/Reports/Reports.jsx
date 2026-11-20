import { useState, useEffect } from "react";
import { getMovementReport } from "../../api/reportApi";
import { toInputDate } from "../../utils/formatDate";
import styles from "./Reports.module.css";

const today = () => toInputDate(new Date());

const monthStart = () => {
  const d = new Date();
  return toInputDate(new Date(d.getFullYear(), d.getMonth(), 1));
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toInputDate(d);
};

const presets = [
  { label: "Today", get: () => ({ from: today(), to: today() }) },
  { label: "Last 7 days", get: () => ({ from: daysAgo(6), to: today() }) },
  { label: "This month", get: () => ({ from: monthStart(), to: today() }) },
  { label: "All time", get: () => ({ from: "", to: "" }) },
];

const formatNet = (n) =>
  n > 0 ? `+${n.toLocaleString()}` : n.toLocaleString();

const netClass = (n, s) => (n > 0 ? s.pos : n < 0 ? s.neg : s.zero);

function Reports() {
  const [range, setRange] = useState(presets[2].get());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (range.from && range.to && range.from > range.to) {
      setError("'From' date cannot be after 'To' date");
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError("");

    getMovementReport({
      from: range.from || undefined,
      to: range.to || undefined,
    })
      .then((res) => {
        if (!ignore) setReport(res.data);
      })
      .catch((err) => {
        if (!ignore)
          setError(err.response?.data?.message || "Could not load report");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [range]);

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.presets}>
          {presets.map((p) => (
            <button
              key={p.label}
              className={styles.presetBtn}
              onClick={() => setRange(p.get())}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.dates}>
          <label className={styles.dateField}>
            From
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
            />
          </label>
          <label className={styles.dateField}>
            To
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
            />
          </label>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock In</th>
              <th>Stock Out</th>
              <th>Net</th>
              <th>Current Stock</th>
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

            {!loading && !error && report?.rows.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.empty}>
                  No products yet
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              report?.rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td className={styles.pos}>{r.stockIn.toLocaleString()}</td>
                  <td className={styles.neg}>{r.stockOut.toLocaleString()}</td>
                  <td className={netClass(r.net, styles)}>
                    {formatNet(r.net)}
                  </td>
                  <td>
                    <span
                      className={
                        r.currentStock <= r.reorderLevel
                          ? styles.low
                          : styles.ok
                      }
                    >
                      {r.currentStock.toLocaleString()} {r.unit}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>

          {!loading && !error && report && report.rows.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="2">Total</td>
                <td className={styles.pos}>
                  {report.totals.stockIn.toLocaleString()}
                </td>
                <td className={styles.neg}>
                  {report.totals.stockOut.toLocaleString()}
                </td>
                <td className={netClass(report.totals.net, styles)}>
                  {formatNet(report.totals.net)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default Reports;
