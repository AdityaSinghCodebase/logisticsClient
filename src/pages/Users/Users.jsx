import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { getUsers, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import UserModal from "../../components/UserModal/UserModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import styles from "./Users.module.css";

const roleLabels = {
  admin: "Admin",
  employee: "Employee",
};

const roleStyles = {
  admin: styles.roleAdmin,
  employee: styles.roleIn,
};

function Users() {
  const { user: me } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getUsers({ search: search || undefined });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load users");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, refresh]);

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setRefresh((n) => n + 1);
  };

  const askDelete = (u) => {
    setDeleteError("");
    setDeletingUser(u);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteUser(deletingUser._id);
      setDeletingUser(null);
      setRefresh((n) => n + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Could not delete user");
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
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className={styles.addBtn} onClick={openAdd}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
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

          {!loading && !error && users.length === 0 && (
            <tr>
              <td colSpan="6" className={styles.empty}>
                No users found
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            users.map((u, index) => {
              const isSelf = u._id === me.id;

              return (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>
                    {u.name}
                    {isSelf && <span className={styles.you}> (you)</span>}
                  </td>
                  <td>
                    <span className={`${styles.role} ${roleStyles[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={u.isActive ? styles.status : styles.statusOff}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.editBtn}
                      aria-label="Edit"
                      onClick={() => openEdit(u)}
                    >
                      <Pencil size={16} />
                    </button>
                    {!isSelf && (
                      <button
                        className={styles.deleteBtn}
                        aria-label="Delete"
                        onClick={() => askDelete(u)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {modalOpen && (
        <UserModal
          user={editingUser}
          isSelf={editingUser?._id === me.id}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deletingUser && (
        <ConfirmModal
          title="Delete user"
          message={`Delete "${deletingUser.name}"? Their past transactions stay in the log. To only stop their access, disable the account instead.`}
          confirmText="Delete"
          loading={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

export default Users;
