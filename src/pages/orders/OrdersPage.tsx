// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

// ===== Components =====
import OrdersFormModal from "./components/OrdersFormModal/OrdersFormModal";
import {
  BaseActionMenu,
  BaseButton,
  BaseCheckbox,
  BaseFilter,
  BaseInput,
  BaseLoading,
  BasePagination,
  BaseSelect,
  BaseTable,
  BaseToast,
} from "@/components";
import BaseConfirmModal from "@/components/base/confirm-modal/BaseConfirmModal";

// ===== Others =====
import type { ColumnType } from "@/utils/interfaces";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { KeyTableEnum } from "@/utils/enum";
import { icons } from "@/assets";
import {
  getPurchaseOrderTotalAmount,
  getPurchaseOrderTotalQuantity,
  purchaseOrderCurrencyFormatter,
} from "@/features/orders/order.helpers";
import type {
  OrderFormValues,
  PurchaseOrderFilterValues,
  PurchaseOrderRow,
} from "@/features/orders/order.types";
import {
  DEFAULT_FILTER_PANEL_WIDTH,
  DEFAULT_FILTER_SELECT_HEIGHT,
  DEFAULT_PURCHASE_ORDER_FILTER_VALUES,
  EMPTY_STRING,
} from "@/utils/constants";
import { useAppDispatch, useOrders } from "@/redux/hooks";
import {
  createPurchaseOrderThunk,
  deletePurchaseOrderThunk,
  getPurchaseOrdersThunk,
  updatePurchaseOrderThunk,
} from "@/redux/thunks/orders/orderThunk";
import { getProductsThunk } from "@/redux/thunks/products/productThunk";
import { getErrorMessage } from "@/utils/errors";

// ===== Styles =====
import styles from "./OrdersPage.module.scss";

const cx = classNames.bind(styles);

const OrdersPage = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    orders: purchaseOrders,
    loading: isLoading,
    isProcessing,
  } = useOrders();

  // ===== States =====
  const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderRow>();
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<PurchaseOrderFilterValues>(
    DEFAULT_PURCHASE_ORDER_FILTER_VALUES,
  );
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedDeleteOrder, setSelectedDeleteOrder] =
    useState<PurchaseOrderRow>();
  const [apiError, setApiError] = useState(EMPTY_STRING);
  const [apiMessage, setApiMessage] = useState(EMPTY_STRING);

  // ===== Effects =====
  useEffect(() => {
    void Promise.all([
      dispatch(getPurchaseOrdersThunk()).unwrap(),
      dispatch(getProductsThunk()).unwrap(),
    ]).catch((error) => {
      console.error("Unable to load purchase orders:", error);
      setApiError(getErrorMessage(error, t));
    });
  }, [dispatch, t]);

  // ===== Handlers =====
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const handleApplyFilter = useCallback(
    (valueFilter: PurchaseOrderFilterValues) => {
      setFilterValues(valueFilter);
    },
    [],
  );

  const handleOpenOrderDetail = useCallback(
    (record: PurchaseOrderRow) => {
      navigate(record.poNumber);
    },
    [navigate],
  );

  const getIsApplyDisabled = useCallback(
    (
      valueFilter: PurchaseOrderFilterValues,
      isChecked: { [K in keyof PurchaseOrderFilterValues]?: boolean },
    ) => {
      if (!isChecked.orderDate) return false;
      if (!valueFilter.fromDate || !valueFilter.toDate) return true;

      return new Date(valueFilter.fromDate) > new Date(valueFilter.toDate);
    },
    [],
  );

  const getHasInvalidDateRange = useCallback(
    (valueFilter: PurchaseOrderFilterValues) => {
      if (!valueFilter.fromDate || !valueFilter.toDate) return false;

      return new Date(valueFilter.fromDate) > new Date(valueFilter.toDate);
    },
    [],
  );

  const handleOpenOrderModal = useCallback(() => {
    setSelectedOrder(undefined);
    setIsOpenOrderModal(true);
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setSelectedOrder(undefined);
    setIsOpenOrderModal(false);
  }, []);

  const handleSubmitOrder = useCallback(
    async (data: OrderFormValues) => {
      setApiError(EMPTY_STRING);
      setApiMessage(EMPTY_STRING);

      try {
        if (selectedOrder) {
          await dispatch(
            updatePurchaseOrderThunk({ id: selectedOrder.id, order: data }),
          ).unwrap();
          setApiMessage(t("orders.api.update_success"));
        } else {
          await dispatch(createPurchaseOrderThunk(data)).unwrap();
          setApiMessage(t("orders.api.create_success"));
        }

        handleCloseOrderModal();
      } catch (error) {
        console.error("Unable to save purchase order:", error);
        setApiError(getErrorMessage(error, t));
      }
    },
    [dispatch, handleCloseOrderModal, selectedOrder, t],
  );

  const handleEditOrder = useCallback((record: PurchaseOrderRow) => {
    setSelectedOrder(record);
    setIsOpenOrderModal(true);
  }, []);

  const handleDeleteOrder = useCallback((record: PurchaseOrderRow) => {
    setSelectedDeleteOrder(record);
    setIsOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setSelectedDeleteOrder(undefined);
    setIsOpenDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedDeleteOrder) return;

    try {
      await dispatch(deletePurchaseOrderThunk(selectedDeleteOrder.id)).unwrap();
      setApiMessage(t("orders.api.delete_success"));
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Unable to delete purchase order:", error);
      setApiError(getErrorMessage(error, t));
    }
  }, [dispatch, handleCloseDeleteModal, selectedDeleteOrder, t]);

  // ===== Memos =====
  const filteredPurchaseOrders = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return purchaseOrders.filter((order) => {
      const searchableText = [
        order.poNumber,
        order.supplier,
        order.note,
        ...order.items.flatMap((item) => [
          item.productSku,
          item.productName,
        ]),
      ]
        .join(" ")
        .toLocaleLowerCase();

      const isMatchedSearch = normalizedSearchValue
        ? searchableText.includes(normalizedSearchValue)
        : true;

      const isMatchedStatus =
        !filterValues.status ||
        filterValues.status === "all" ||
        order.status === filterValues.status;

      const isMatchedFromDate =
        filterValues.orderDate && filterValues.fromDate
        ? new Date(order.orderDate) >= new Date(filterValues.fromDate)
        : true;

      const isMatchedToDate =
        filterValues.orderDate && filterValues.toDate
        ? new Date(order.orderDate) <= new Date(filterValues.toDate)
        : true;

      return (
        isMatchedSearch &&
        isMatchedStatus &&
        isMatchedFromDate &&
        isMatchedToDate
      );
    });
  }, [filterValues, purchaseOrders, searchValue]);

  const orderFormInitialValues = useMemo<OrderFormValues | undefined>(() => {
    if (!selectedOrder) return undefined;

    return {
      supplier: selectedOrder.supplier,
      orderDate: selectedOrder.orderDate,
      status: selectedOrder.status,
      note: selectedOrder.note,
      items: selectedOrder.items.map((item) => ({
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  }, [selectedOrder]);

  const purchaseOrderStatusOptions = useMemo(
    () => [
      {
        label: t("orders.status_all"),
        value: "all",
      },
      {
        label: t("orders.status_pending"),
        value: "Pending",
      },
      {
        label: t("orders.status_received"),
        value: "Received",
      },
      {
        label: t("orders.status_cancelled"),
        value: "Cancelled",
      },
    ],
    [t],
  );

  const purchaseOrderColumns = useMemo((): ColumnType<PurchaseOrderRow>[] => {
    return [
      {
        title: t("orders.po_number"),
        dataIndex: "poNumber",
        key: "poNumber",
        width: 180,
        tooltip: true,
      },
      {
        title: t("orders.order_date"),
        dataIndex: "orderDate",
        key: "orderDate",
        width: 150,
        tooltip: true,
      },
      {
        title: t("orders.supplier"),
        dataIndex: "supplier",
        key: "supplier",
        width: 220,
        tooltip: true,
      },
      {
        title: t("orders.total_quantity"),
        key: "totalQuantity",
        width: 150,
        tooltip: true,
        render: (_, record) => getPurchaseOrderTotalQuantity(record.items),
      },
      {
        title: t("orders.total_amount"),
        key: "totalAmount",
        width: 180,
        tooltip: true,
        render: (_, record) =>
          purchaseOrderCurrencyFormatter.format(
            getPurchaseOrderTotalAmount(record.items),
          ),
      },
      {
        title: t("orders.status"),
        dataIndex: "status",
        key: "status",
        width: 150,
        tooltip: true,
        render: (_, record) => (
          <span
            className={cx("status", {
              statusPending: record.status === "Pending",
              statusReceived: record.status === "Received",
              statusCancelled: record.status === "Cancelled",
            })}
          >
            {t(`orders.status_${record.status.toLowerCase()}`)}
          </span>
        ),
      },
      {
        title: t("common.actions"),
        key: KeyTableEnum.ACTION,
        width: 120,
        render: (_, record) => (
          <div className={cx("tableActions")}>
            <BaseActionMenu
              actions={[
                {
                  icon: icons.iconView,
                  label: t("common.btn_view"),
                  onClick: () => handleOpenOrderDetail(record),
                },
                {
                  icon: icons.iconEdit,
                  label: t("common.btn_edit"),
                  onClick: () => handleEditOrder(record),
                },
                {
                  icon: icons.iconTrash,
                  label: t("common.btn_delete"),
                  variant: "danger",
                  onClick: () => handleDeleteOrder(record),
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, [handleDeleteOrder, handleEditOrder, handleOpenOrderDetail, t]);

  return (
    <div className={cx("wrapper")}>
      <section className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <p className={cx("pageTitle")}>
            {t("orders.title")}: {filteredPurchaseOrders.length}
          </p>

          <div className={cx("toolbarActions")}>
            <BaseInput
              type={InputTypeEnum.TEXT}
              height={45}
              borderRadius={12}
              placeholder={t("orders.search_placeholder")}
              className={cx("searchInput")}
              value={searchValue}
              onChange={handleSearchChange}
            />

            <BaseFilter<PurchaseOrderFilterValues>
              valueFilter={filterValues}
              defaultValue={DEFAULT_PURCHASE_ORDER_FILTER_VALUES}
              widthPanel={DEFAULT_FILTER_PANEL_WIDTH}
              onApply={handleApplyFilter}
              isApplyDisabled={getIsApplyDisabled}
            >
              {({ valueFilter, isChecked, onCheckboxChange, onChange }) => (
                <div className={cx("filterContainer")}>
                  <div className={cx("filterGroup")}>
                    <BaseCheckbox
                      name="status"
                      label={t("orders.status")}
                      value={!!isChecked?.status}
                      onChange={(checked: boolean) => {
                        onCheckboxChange("status", checked);
                      }}
                    />

                    {isChecked?.status && (
                      <div className={cx("contentFilterWrap")}>
                        <BaseSelect
                          name="status"
                          options={purchaseOrderStatusOptions}
                          height={DEFAULT_FILTER_SELECT_HEIGHT}
                          value={valueFilter.status}
                          placeholder={t("orders.status")}
                          onChange={({ value }, name) => {
                            onChange({
                              name: name as keyof PurchaseOrderFilterValues,
                              value,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className={cx("filterGroup")}>
                    <BaseCheckbox
                      name="orderDate"
                      label={t("orders.order_date")}
                      value={!!isChecked?.orderDate}
                      onChange={(checked: boolean) => {
                        onCheckboxChange("orderDate", checked);
                        onChange({
                          name: "orderDate",
                          value: checked,
                        });

                        if (!checked) {
                          onChange({ name: "fromDate", value: "" });
                          onChange({ name: "toDate", value: "" });
                        }
                      }}
                    />

                    {isChecked?.orderDate && (
                      <div className={cx("dateRangeFilterWrap")}>
                        <div className={cx("dateField")}>
                          <span>{t("orders.from_date")}</span>

                          <BaseInput
                            name="fromDate"
                            type={InputTypeEnum.DATE}
                            value={valueFilter.fromDate}
                            height={DEFAULT_FILTER_SELECT_HEIGHT}
                            onChange={(event) => {
                              onChange({
                                name: "fromDate",
                                value: event.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className={cx("dateField")}>
                          <span>{t("orders.to_date")}</span>

                          <BaseInput
                            name="toDate"
                            type={InputTypeEnum.DATE}
                            value={valueFilter.toDate}
                            height={DEFAULT_FILTER_SELECT_HEIGHT}
                            onChange={(event) => {
                              onChange({
                                name: "toDate",
                                value: event.target.value,
                              });
                            }}
                          />
                        </div>

                        {getHasInvalidDateRange(valueFilter) && (
                          <p className={cx("dateError")}>
                            {t("orders.invalid_date_range")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </BaseFilter>

            <BaseButton
              isStatic
              onClick={handleOpenOrderModal}
              className={cx("addButton")}
            >
              {t("orders.add_order")}
            </BaseButton>
          </div>
        </div>
      </section>

      <div className={cx("table")}>
        {isLoading ? (
          <BaseLoading />
        ) : (
          <BaseTable
            columns={purchaseOrderColumns}
            dataSource={filteredPurchaseOrders}
            onClickRow={handleOpenOrderDetail}
          />
        )}
      </div>

      <BasePagination
        currentPage={1}
        totalItems={filteredPurchaseOrders.length}
        totalPages={1}
        onChange={() => undefined}
      />

      <OrdersFormModal
        isOpen={isOpenOrderModal}
        isLoading={isProcessing}
        initialValues={orderFormInitialValues}
        onClose={handleCloseOrderModal}
        onSubmit={handleSubmitOrder}
      />

      <BaseConfirmModal
        isOpen={isOpenDeleteModal}
        title={t("common.confirm_delete")}
        description={
          <Trans
            i18nKey="common.delete_description"
            values={{ value: selectedDeleteOrder?.poNumber }}
            components={[<strong key="strong" />]}
          />
        }
        variant="danger"
        isLoading={isProcessing}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <BaseToast
        isOpen={Boolean(apiError || apiMessage)}
        message={apiError || apiMessage}
        variant={apiError ? "error" : "success"}
        onClose={() => {
          setApiError(EMPTY_STRING);
          setApiMessage(EMPTY_STRING);
        }}
      />
    </div>
  );
};

export default OrdersPage;
