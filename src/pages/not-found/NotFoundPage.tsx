// ===== Libs =====
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

// ===== Components =====
import { BaseButton } from "@/components";

// ===== Styles =====
import styles from "./NotFoundPage.module.scss";

const cx = classNames.bind(styles);

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className={cx("page")}>
      <section className={cx("content")}>
        <span className={cx("code")}>{t("not_found.code")}</span>
        <h1 className={cx("title")}>{t("not_found.title")}</h1>
        <p className={cx("description")}>{t("not_found.description")}</p>

        <BaseButton onClick={() => navigate("/")}>
          {t("not_found.back_home")}
        </BaseButton>
      </section>
    </main>
  );
};

export default NotFoundPage;
