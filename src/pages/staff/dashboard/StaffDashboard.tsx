// ============================================================
// STAFF DASHBOARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// ===== Styles =====
import styles from "../../admin/dashboard/AdminDashboard.module.scss";

const cx = classNames.bind(styles);

const productChartBars = [64, 52, 76, 44, 68, 58, 72];
const purchaseOrderChartBars = [38, 58, 46, 70, 54, 76, 62];

const recentPurchaseOrders = [
  {
    id: "PO-1024",
    supplier: "Global Supplies",
    status: "Pending",
    total: "$2,420",
    date: "May 28",
  },
  {
    id: "PO-1023",
    supplier: "Bright Warehouse",
    status: "Approved",
    total: "$1,860",
    date: "May 27",
  },
  {
    id: "PO-1022",
    supplier: "Northwind Trading",
    status: "Received",
    total: "$3,120",
    date: "May 26",
  },
];

const lowStockProducts = [
  {
    name: "Wireless Mouse",
    sku: "PRD-2041",
    stock: 4,
    status: "Critical",
  },
  {
    name: "USB-C Cable",
    sku: "PRD-1088",
    stock: 8,
    status: "Low",
  },
  {
    name: "Laptop Stand",
    sku: "PRD-3320",
    stock: 11,
    status: "Low",
  },
];

const StaffDashboard = () => {
  const { t } = useTranslation();
  const [isContentScrolled, setIsContentScrolled] = useState(false);

  const statisticCards = [
    {
      title: t("dashboard.products"),
      value: "1,248",
      description: t("dashboard.total_products"),
    },
    {
      title: t("dashboard.purchase_orders"),
      value: "326",
      description: t("dashboard.total_purchase_orders"),
    },
    {
      title: t("dashboard.low_stock"),
      value: "24",
      description: t("dashboard.need_attention"),
    },
  ];

  return (
    <div
      className={cx("wrapper", { wrapperScrolled: isContentScrolled })}
      onScroll={(event) => {
        setIsContentScrolled(event.currentTarget.scrollTop > 0);
      }}
    >
      <section className={cx("heroSection")}>
        <p className={cx("title")}>{t("dashboard.overview")}</p>
      </section>

      <section className={cx("statGrid", "statGridThreeColumns")}>
        {statisticCards.map((card) => {
          return (
            <article key={card.title} className={cx("statCard")}>
              <p className={cx("statTitle")}>{card.title}</p>
              <h2 className={cx("statValue")}>{card.value}</h2>
              <p className={cx("statDescription")}>{card.description}</p>
            </article>
          );
        })}
      </section>

      <section className={cx("chartGrid")}>
        <article className={cx("panelCard")}>
          <div className={cx("panelHeader")}>
            <div>
              <h3 className={cx("panelTitle")}>
                {t("dashboard.products_chart")}
              </h3>
              <p className={cx("panelDescription")}>
                {t("dashboard.product_activity_by_week")}
              </p>
            </div>
          </div>

          <div className={cx("barChart")}>
            {productChartBars.map((height, index) => {
              return (
                <span
                  key={index}
                  className={cx("chartBar")}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </article>

        <article className={cx("panelCard")}>
          <div className={cx("panelHeader")}>
            <div>
              <h3 className={cx("panelTitle")}>
                {t("dashboard.purchase_orders_chart")}
              </h3>
              <p className={cx("panelDescription")}>
                {t("dashboard.purchase_orders_by_week")}
              </p>
            </div>
          </div>

          <div className={cx("barChart")}>
            {purchaseOrderChartBars.map((height, index) => {
              return (
                <span
                  key={index}
                  className={cx("chartBar")}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </article>
      </section>

      <section className={cx("tableGrid")}>
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

          <div className={cx("tableList")}>
            {recentPurchaseOrders.map((order) => {
              return (
                <div key={order.id} className={cx("tableRow")}>
                  <div>
                    <p className={cx("rowTitle")}>{order.id}</p>
                    <p className={cx("rowSubtitle")}>{order.supplier}</p>
                  </div>

                  <span className={cx("statusBadge")}>{order.status}</span>

                  <div className={cx("rowMeta")}>
                    <p>{order.total}</p>
                    <span>{order.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className={cx("panelCard")}>
          <div className={cx("panelHeader")}>
            <div>
              <h3 className={cx("panelTitle")}>
                {t("dashboard.low_stock_products")}
              </h3>
              <p className={cx("panelDescription")}>
                {t("dashboard.products_need_restocking")}
              </p>
            </div>
          </div>

          <div className={cx("tableList")}>
            {lowStockProducts.map((product) => {
              return (
                <div key={product.sku} className={cx("tableRow")}>
                  <div>
                    <p className={cx("rowTitle")}>{product.name}</p>
                    <p className={cx("rowSubtitle")}>{product.sku}</p>
                  </div>

                  <span className={cx("stockBadge")}>
                    {t("dashboard.stock_left", { count: product.stock })}
                  </span>

                  <div className={cx("rowMeta")}>
                    <p>{product.status}</p>
                    <span>{t("dashboard.stock_alert")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
};

export default StaffDashboard;
