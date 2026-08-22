// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Others =====
import { getProductStatus } from "@/features/products/product.helpers";

// ===== Types =====
import type { DashboardLowStockProduct } from "../types";

// ===== Styles =====
import styles from "../Dashboard.module.scss";

type Props = {
  products: DashboardLowStockProduct[];
};

const cx = classNames.bind(styles);

const LowStockPanel = ({ products }: Props) => {
  const { t } = useTranslation();

  return (
    <article className={cx("panelCard")}>
      <div className={cx("panelHeader")}>
        <div>
          <h3 className={cx("panelTitle")}>{t("dashboard.low_stock_products")}</h3>
          <p className={cx("panelDescription")}>
            {t("dashboard.products_need_restocking")}
          </p>
        </div>
      </div>

      {products.length ? (
        <div className={cx("tableList")}>
          {products.map((product) => {
            const status = getProductStatus(product.stock);

            return (
              <div key={product.id} className={cx("tableRow")}>
                <div className={cx("rowContent")}>
                  <p className={cx("rowTitle")}>{product.name}</p>
                  <p className={cx("rowSubtitle")}>{product.sku}</p>
                </div>
                <span className={cx("stockBadge")}>
                  {t("dashboard.stock_left", { count: product.stock })}
                </span>
                <div className={cx("rowMeta")}>
                  <p>{t(`products.status_${status.toLowerCase()}`)}</p>
                  <span>{t("dashboard.stock_alert")}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={cx("emptyState")}>{t("dashboard.no_stock_alerts")}</div>
      )}
    </article>
  );
};

export default LowStockPanel;
