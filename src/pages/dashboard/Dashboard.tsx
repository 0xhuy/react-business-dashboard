// ============================================================
// DASHBOARD
// ============================================================

// ===== Libs =====
import classNames from "classnames/bind";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ===== Components =====
import { BaseButton, BaseLoading } from "@/components";
import DashboardChart from "./components/DashboardChart";
import LowStockPanel from "./components/LowStockPanel";
import RecentPurchaseOrdersPanel from "./components/RecentPurchaseOrdersPanel";

// ===== Others =====
import {
  useAppDispatch,
  useAuth,
  useOrders,
  useProducts,
  useUsers,
} from "@/redux/hooks";
import { getPurchaseOrdersThunk } from "@/redux/thunks/orders/orderThunk";
import { getProductsThunk } from "@/redux/thunks/products/productThunk";
import { getUsersThunk } from "@/redux/thunks/users/userThunk";
import { LanguageLocaleEnum } from "@/utils/enum";
import { getCurrencyFormatter, getLanguage } from "@/utils/helper";
import {
  getLowestStockProducts,
  getProductChartData,
  getPurchaseOrderChartData,
  getRecentPurchaseOrders,
  getStockAlertProducts,
} from "./helpers";
import { DASHBOARD_CONFIG_BY_ROLE } from "./constants";

// ===== Types =====
import type { DashboardStatisticCard } from "./types";

// ===== Styles =====
import styles from "./Dashboard.module.scss";

const cx = classNames.bind(styles);

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const { products, loading: isProductsLoading } = useProducts();
  const { orders, loading: isOrdersLoading } = useOrders();
  const { users, loading: isUsersLoading } = useUsers();

  const [isContentScrolled, setIsContentScrolled] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const dashboardConfig = role ? DASHBOARD_CONFIG_BY_ROLE[role] : null;
  const canViewPurchaseOrders = dashboardConfig?.canViewPurchaseOrders ?? false;
  const canViewUsers = dashboardConfig?.canViewUsers ?? false;

  const language = getLanguage(i18n.language);
  const locale =
    language === "vi" ? LanguageLocaleEnum.VI : LanguageLocaleEnum.EN;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const currencyFormatter = useMemo(
    () => getCurrencyFormatter(language),
    [language],
  );

  useEffect(() => {
    if (!dashboardConfig) return;

    let isActive = true;

    const loadDashboard = async () => {
      const requests: Promise<unknown>[] = [
        dispatch(getProductsThunk()).unwrap(),
      ];

      if (canViewPurchaseOrders) {
        requests.push(dispatch(getPurchaseOrdersThunk()).unwrap());
      }

      if (canViewUsers) {
        requests.push(dispatch(getUsersThunk()).unwrap());
      }

      try {
        await Promise.all(requests);
      } catch (error) {
        console.error("Unable to load dashboard:", error);
        if (isActive) setHasLoadError(true);
      }
    };

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, [canViewPurchaseOrders, canViewUsers, dashboardConfig, dispatch]);

  const stockAlertProducts = useMemo(
    () => getStockAlertProducts(products),
    [products],
  );
  const lowestStockProducts = useMemo(
    () => getLowestStockProducts(products),
    [products],
  );
  const productChartData = useMemo(
    () => getProductChartData(products, t),
    [products, t],
  );
  const purchaseOrderChartData = useMemo(
    () => getPurchaseOrderChartData(orders, t),
    [orders, t],
  );
  const recentPurchaseOrders = useMemo(
    () => getRecentPurchaseOrders(orders),
    [orders],
  );

  const statisticCards = useMemo<DashboardStatisticCard[]>(() => {
    const cards = [
      {
        title: t("dashboard.products"),
        value: numberFormatter.format(products.length),
        description: t("dashboard.total_products"),
      },
      {
        title: t("dashboard.low_stock"),
        value: numberFormatter.format(stockAlertProducts.length),
        description: t("dashboard.need_attention"),
      },
    ];

    if (canViewPurchaseOrders) {
      cards.splice(1, 0, {
        title: t("dashboard.purchase_orders"),
        value: numberFormatter.format(orders.length),
        description: t("dashboard.total_purchase_orders"),
      });
    }

    if (canViewUsers) {
      cards.push({
        title: t("dashboard.users"),
        value: numberFormatter.format(
          users.filter((user) => user.status === "Active").length,
        ),
        description: t("dashboard.active_users"),
      });
    }

    return cards;
  }, [
    canViewPurchaseOrders,
    canViewUsers,
    numberFormatter,
    orders.length,
    products.length,
    stockAlertProducts.length,
    t,
    users,
  ]);

  const isLoading =
    isProductsLoading ||
    (canViewPurchaseOrders && isOrdersLoading) ||
    (canViewUsers && isUsersLoading);

  const handleViewPurchaseOrders = () => {
    if (dashboardConfig?.purchaseOrdersPath) {
      navigate(dashboardConfig.purchaseOrdersPath);
    }
  };

  if (!dashboardConfig || isLoading) return <BaseLoading variant="page" />;

  return (
    <div
      className={cx("wrapper", { wrapperScrolled: isContentScrolled })}
      onScroll={(event) => {
        setIsContentScrolled(event.currentTarget.scrollTop > 0);
      }}
    >
      <section className={cx("heroSection")}>
        <div>
          <p className={cx("title")}>{t("dashboard.overview")}</p>
          <p className={cx("heroDescription")}>
            {t("dashboard.overview_description")}
          </p>
        </div>

        <div className={cx("heroActions")}>
          <BaseButton
            size="sm"
            variant="secondary"
            onClick={() => navigate(dashboardConfig.productsPath)}
          >
            {t("dashboard.view_products")}
          </BaseButton>
          {canViewPurchaseOrders && dashboardConfig.purchaseOrdersPath && (
            <BaseButton
              size="sm"
              variant="secondary"
              onClick={handleViewPurchaseOrders}
            >
              {t("dashboard.view_purchase_orders")}
            </BaseButton>
          )}
        </div>
      </section>

      {hasLoadError && (
        <div className={cx("errorState")}>{t("dashboard.load_error")}</div>
      )}

      <section
        className={cx("statGrid", {
          statGridThreeColumns: statisticCards.length === 3,
          statGridTwoColumns: statisticCards.length === 2,
        })}
      >
        {statisticCards.map((card) => (
          <article key={card.title} className={cx("statCard")}>
            <p className={cx("statTitle")}>{card.title}</p>
            <h2 className={cx("statValue")}>{card.value}</h2>
            <p className={cx("statDescription")}>{card.description}</p>
          </article>
        ))}
      </section>

      <section className={cx("chartGrid")}>
        <DashboardChart
          title={t("dashboard.products_chart")}
          description={t("dashboard.product_activity_by_week")}
          data={productChartData}
        />
        {canViewPurchaseOrders ? (
          <DashboardChart
            title={t("dashboard.purchase_orders_chart")}
            description={t("dashboard.purchase_orders_by_week")}
            data={purchaseOrderChartData}
          />
        ) : (
          <LowStockPanel products={lowestStockProducts} />
        )}
      </section>

      {canViewPurchaseOrders && (
        <section className={cx("tableGrid")}>
          <RecentPurchaseOrdersPanel
            orders={recentPurchaseOrders}
            formatCurrency={(value) => currencyFormatter.format(value)}
          />
          <LowStockPanel products={lowestStockProducts} />
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
