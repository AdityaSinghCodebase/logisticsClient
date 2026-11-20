import styles from "./LowStockTable.module.css";

function LowStockTable({ items }) {
  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>Low Stock Items</h3>

      {items.length === 0 ? (
        <p className={styles.empty}>All products are well stocked.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Reorder Level</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <span className={styles.badge}>{item.stock}</span>
                </td>
                <td>{item.reorderLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LowStockTable;
