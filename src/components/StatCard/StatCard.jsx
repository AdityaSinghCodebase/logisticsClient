import styles from "./StatCard.module.css";

function StatCard({ title, value, icon: Icon, variant }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconBox} ${styles[variant]}`}>
        <Icon size={26} />
      </div>
      <div>
        <p className={styles.title}>{title}</p>
        <h2 className={styles.value}>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;
