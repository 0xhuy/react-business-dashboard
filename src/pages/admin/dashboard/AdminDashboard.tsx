// ============================================================
// ADMIN DASHBOARD
// ============================================================

// ===== Styles =====
import styles from "./AdminDashboard.module.scss";

const AdminDashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        <div className={styles.card}>Users</div>
        <div className={styles.card}>Revenue</div>
        <div className={styles.card}>Orders</div>
        <div className={styles.card}>Growth</div>
      </div>

      <div className={styles.chart}>Chart here</div>
    </div>
  );
};

export default AdminDashboard;
