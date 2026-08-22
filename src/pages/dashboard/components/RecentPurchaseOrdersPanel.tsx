// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Others =====
import { getPurchaseOrderTotalAmount } from "@/features/orders/order.helpers";
import type { PurchaseOrderRow } from "@/features/orders/order.types";

// ===== Styles =====
import styles from "../Dashboard.module.scss";

type Props = {
  orders: PurchaseOrderRow[];
  formatCurrency: (value: number) => string;
};

const cx = classNames.bind(styles);

const RecentPurchaseOrdersPanel = ({ orders, formatCurrency }: Props) => {
  const { t } = useTranslation();

  return (
    <article className={cx("panelCard")}>
      <div className={cx("panelHeader")}>
        <div>
          <h3 className={cx("panelTitle")}>
            {t("dashboard.recent_purchase_orders")}
          </h3>
          <p className={cx("panelDescription")}>
            {t("dashboard.latest_purchase_order_activity")}
          </p>
        </div>
      </div>

      {orders.length ? (
        <div className={cx("tableList")}>
          {orders.map((order) => (
            <div key={order.id} className={cx("tableRow")}>
              <div className={cx("rowContent")}>
                <p className={cx("rowTitle")}>{order.poNumber}</p>
                <p className={cx("rowSubtitle")}>{order.supplier}</p>
              </div>
              <span className={cx("statusBadge", `status${order.status}`)}>
                {t(`orders.status_${order.status.toLowerCase()}`)}
              </span>
              <div className={cx("rowMeta")}>
                <p>{formatCurrency(getPurchaseOrderTotalAmount(order.items))}</p>
                <span>{order.orderDate}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={cx("emptyState")}>{t("dashboard.no_recent_orders")}</div>
      )}
    </article>
  );
};

export default RecentPurchaseOrdersPanel;
