import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { getProducts, deleteProduct } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import ProductModal from "../../components/ProductModal/ProductModal";
import styles from "./Products.module.css";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

function Products() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const colCount = isAdmin ? 6 : 5;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProducts({ search });
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, refresh]);

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setRefresh((n) => n + 1);
  };

  const askDelete = (product) => {
    setDeleteError("");
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteProduct(deletingProduct._id);
      setDeletingProduct(null);
      setRefresh((n) => n + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isAdmin && (
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Unit</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={colCount} className={styles.empty}>
                Loading...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={colCount} className={styles.errorMsg}>
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && products.length === 0 && (
            <tr>
              <td colSpan={colCount} className={styles.empty}>
                No products found
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <span
                    className={
                      product.stock <= product.reorderLevel
                        ? styles.low
                        : styles.ok
                    }
                  >
                    {product.stock.toLocaleString()}
                  </span>
                </td>
                <td>{product.unit}</td>
                {isAdmin && (
                  <td>
                    <button
                      className={styles.editBtn}
                      aria-label="Edit"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      aria-label="Delete"
                      onClick={() => askDelete(product)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingProduct && (
        <ConfirmModal
          title="Delete product"
          message={`Are you sure you want to delete "${deletingProduct.name}"? This cannot be undone.`}
          confirmText="Delete"
          loading={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}

export default Products;
