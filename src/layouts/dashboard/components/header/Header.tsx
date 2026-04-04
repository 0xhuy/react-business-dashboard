// ===== Styles =====
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>Dashboard</div>

      <div className={styles.right}>
        <div className={styles.icon}>🔔</div>
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
};

export default Header;
