// ============================================================
// VIEWER DASHBOARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Styles =====
import styles from "../../admin/dashboard/AdminDashboard.module.scss";

const cx = classNames.bind(styles);

const productChartBars = [72, 48, 64, 36, 82, 56, 68];

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

const ViewerDashboard = () => {
  const { t } = useTranslation();

  const statisticCards = [
    {
      title: t("dashboard.products"),
      value: "1,248",
      description: t("dashboard.total_products"),
    },
    {
      title: t("dashboard.low_stock"),
      value: "24",
      description: t("dashboard.need_attention"),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <section className={cx("heroSection")}>
        <p className={cx("title")}>{t("dashboard.overview")}</p>
      </section>

      <section className={cx("statGrid")}>
        {statisticCards.map((card) => (
          <article key={card.title} className={cx("statCard")}>
            <p className={cx("statTitle")}>{card.title}</p>
            <h2 className={cx("statValue")}>{card.value}</h2>
            <p className={cx("statDescription")}>{card.description}</p>
          </article>
        ))}
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
            {productChartBars.map((height, index) => (
              <span
                key={index}
                className={cx("chartBar")}
                style={{ height: `${height}%` }}
              />
            ))}
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
            {lowStockProducts.map((product) => (
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
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default ViewerDashboard;
