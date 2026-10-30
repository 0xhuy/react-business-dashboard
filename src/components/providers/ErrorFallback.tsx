// ===== Libs =====
import { useTranslation } from "react-i18next";

// ===== Components =====
import { BaseButton } from "@/components/base";

// ===== Others =====
import { HTTP_STATUS_CODE } from "@/utils/constants";

// ===== Styles =====
import styles from "./ErrorFallback.module.scss";

export const ErrorFallback = () => {
  // ===== Hooks =====
  const { t } = useTranslation();

  return (
    <main className={styles.page}>
      <section className={styles.content} role="alert">
        <span className={styles.code}>
          {HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR}
        </span>
        <h1 className={styles.title}>{t("errors.boundary.title")}</h1>
        <p className={styles.description}>{t("errors.boundary.description")}</p>

        <BaseButton onClick={() => window.location.reload()}>
          {t("errors.boundary.reload")}
        </BaseButton>
      </section>
    </main>
  );
};
