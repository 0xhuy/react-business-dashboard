// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// ===== Components =====
import { BaseButton, BaseModal } from "@/components";
import OrdersFormModal from "./components/OrdersFormModal/OrdersFormModal";
import type { OrderFormValues } from "./components/OrdersFormModal/types";

// ===== Others =====
import { PURCHASE_ORDER_DATA_SOURCE } from "@/utils/constants/orders.constants";
import {
  getPurchaseOrderTotalAmount,
  getPurchaseOrderTotalItems,
  getPurchaseOrderTotalQuantity,
} from "./helpers";

// ===== Styles =====
import styles from "./OrderDetailPage.module.scss";
import { IconArrow } from "@/assets";
import { DEFAULT_CURRENCY } from "@/utils/constants";

const cx = classNames.bind(styles);

// ===== Component =====
const OrderDetailPage = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: DEFAULT_CURRENCY,
      }),
    [i18n.language],
  );

  // ===== States =====
  const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  // ===== Memos =====
  const purchaseOrder = useMemo(() => {
    return PURCHASE_ORDER_DATA_SOURCE.find((order) => order.poNumber === id);
  }, [id]);

  const summary = useMemo(() => {
    if (!purchaseOrder) {
      return {
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0,
      };
    }

    return {
      totalItems: getPurchaseOrderTotalItems(purchaseOrder.items),
      totalQuantity: getPurchaseOrderTotalQuantity(purchaseOrder.items),
      totalAmount: getPurchaseOrderTotalAmount(purchaseOrder.items),
    };
  }, [purchaseOrder]);

  const orderFormInitialValues = useMemo<OrderFormValues | undefined>(() => {
    if (!purchaseOrder) return undefined;

    return {
      orderDate: purchaseOrder.orderDate,
      status: purchaseOrder.status,
      note: purchaseOrder.note,
      items: purchaseOrder.items.map((item) => ({
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  }, [purchaseOrder]);

  // ===== Handlers =====
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEditOrder = useCallback(() => {
    setIsOpenOrderModal(true);
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setIsOpenOrderModal(false);
  }, []);

  const handleSubmitOrder = useCallback(
    (data: OrderFormValues) => {
      console.log("Submit purchase order", data);
      handleCloseOrderModal();
    },
    [handleCloseOrderModal],
  );

  const handleDeleteOrder = useCallback(() => {
    setIsOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsOpenDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    console.log("Delete purchase order", purchaseOrder);
    handleCloseDeleteModal();
    navigate(-1);
  }, [handleCloseDeleteModal, navigate, purchaseOrder]);

  if (!purchaseOrder) {
    return (
      <div className={cx("wrapper")}>
        <section className={cx("detailHeaderCard")}>
          <div>
            <button
              className={cx("backButton")}
              type="button"
              onClick={handleBack}
            >
              <IconArrow width={40} height={40} strokePath="currentColor" />
              {t("orders.title")}
            </button>
            <p className={cx("detailTitle")}>{t("orders.not_found")}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <section className={cx("detailHeaderCard")}>
        <div className={cx("detailHeaderTop")}>
          <div>
            <button
              className={cx("backButton")}
              type="button"
              onClick={handleBack}
            >
              <span className={cx("leftChevronIcon")}>
                <IconArrow width={30} height={30} strokePath="currentColor" />
              </span>
              {t("orders.title")}
            </button>

            <div className={cx("detailTitleWrap")}>
              <p className={cx("detailTitle")}>{purchaseOrder.poNumber}</p>
              <span
                className={cx("status", {
                  statusPending: purchaseOrder.status === "Pending",
                  statusReceived: purchaseOrder.status === "Received",
                  statusCancelled: purchaseOrder.status === "Cancelled",
                })}
              >
                {t(`orders.status_${purchaseOrder.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          <div className={cx("detailActions")}>
            <BaseButton
              variant="outline"
              isStatic
              onClick={handleEditOrder}
              className={cx("actionButton")}
            >
              {t("common.btn_edit")}
            </BaseButton>

            <BaseButton
              variant="danger"
              isStatic
              onClick={handleDeleteOrder}
              className={cx("actionButton")}
            >
              {t("common.btn_delete")}
            </BaseButton>
          </div>
        </div>

        <div className={cx("detailSummaryGrid")}>
          <div className={cx("detailSummaryItem")}>
            <span>{t("orders.order_date")}</span>
            <p>{purchaseOrder.orderDate}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("orders.total_items")}</span>
            <p>{summary.totalItems}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("orders.total_quantity")}</span>
            <p>{summary.totalQuantity}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("orders.total_amount")}</span>
            <p>{currencyFormatter.format(summary.totalAmount)}</p>
          </div>
        </div>
      </section>

      <section className={cx("detailContentGrid")}>
        <div className={cx("detailMain")}>
          <div className={cx("detailCard")}>
            <div className={cx("detailSectionHeader")}>
              <div>
                <p>{t("orders.product_list")}</p>
                <span>{t("orders.product_list_description")}</span>
              </div>
            </div>

            <div className={cx("detailTable")}>
              <div className={cx("detailTableHeader")}>
                <p>{t("orders.product")}</p>
                <p>{t("products.sku")}</p>
                <p>{t("orders.quantity")}</p>
                <p>{t("orders.unit_price")}</p>
                <p>{t("orders.total")}</p>
              </div>

              <div className={cx("detailTableBody")}>
                {purchaseOrder.items.map((item) => (
                  <div className={cx("detailTableRow")} key={item.productSku}>
                    <p>{item.productName}</p>
                    <p>{item.productSku}</p>
                    <p>{item.quantity}</p>
                    <p>{currencyFormatter.format(item.unitPrice)}</p>
                    <p>
                      {currencyFormatter.format(item.quantity * item.unitPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className={cx("detailSidebar")}>
          <div className={cx("detailCard")}>
            <p className={cx("detailCardTitle")}>
              {t("orders.order_information")}
            </p>

            <div className={cx("detailInfoList")}>
              <div>
                <span>{t("orders.po_number")}</span>
                <p>{purchaseOrder.poNumber}</p>
              </div>

              <div>
                <span>{t("orders.order_date")}</span>
                <p>{purchaseOrder.orderDate}</p>
              </div>

              <div>
                <span>{t("orders.status")}</span>
                <p>
                  {t(`orders.status_${purchaseOrder.status.toLowerCase()}`)}
                </p>
              </div>
            </div>
          </div>

          <div className={cx("detailCard")}>
            <p className={cx("detailCardTitle")}>{t("orders.note")}</p>
            <p className={cx("detailNoteText")}>{purchaseOrder.note}</p>
          </div>
        </aside>
      </section>

      <OrdersFormModal
        isOpen={isOpenOrderModal}
        initialValues={orderFormInitialValues}
        onClose={handleCloseOrderModal}
        onSubmit={handleSubmitOrder}
      />

      <BaseModal
        isOpen={isOpenDeleteModal}
        title={t("common.confirm_delete")}
        width={520}
        onClose={handleCloseDeleteModal}
        footer={
          <>
            <BaseButton
              variant="outline"
              isStatic
              onClick={handleCloseDeleteModal}
            >
              {t("common.btn_cancel")}
            </BaseButton>

            <BaseButton variant="danger" isStatic onClick={handleConfirmDelete}>
              {t("common.btn_delete")}
            </BaseButton>
          </>
        }
      >
        <Trans
          i18nKey="common.delete_description"
          values={{ value: purchaseOrder.poNumber }}
          components={[<strong key="strong" />]}
        />
      </BaseModal>
    </div>
  );
};

export default OrderDetailPage;
