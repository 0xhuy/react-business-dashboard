// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useMemo, useState } from "react";
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
  BasePagination,
  BaseSelect,
  BaseTable,
} from "@/components";
import BaseConfirmModal from "@/components/base/confirm-modal/BaseConfirmModal";

// ===== Others =====
import type { OrderFormValues } from "./components/OrdersFormModal/types";
import type { ColumnType } from "@/utils/interfaces";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { KeyTableEnum } from "@/utils/enum";
import { icons } from "@/assets";
import type { PurchaseOrderFilterValues, PurchaseOrderRow } from "./type";
import {
  getPurchaseOrderTotalAmount,
  getPurchaseOrderTotalItems,
  getPurchaseOrderTotalQuantity,
  purchaseOrderCurrencyFormatter,
} from "./helpers";
import {
  DEFAULT_PURCHASE_ORDER_FILTER_VALUES,
  PURCHASE_ORDER_DATA_SOURCE,
  PURCHASE_ORDER_STATUS_OPTIONS,
} from "@/utils/constants/orders.constants";

// ===== Styles =====
import styles from "./OrdersPage.module.scss";

const cx = classNames.bind(styles);

const OrdersPage = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ===== States =====
  const purchaseOrders = PURCHASE_ORDER_DATA_SOURCE;
  const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderFormValues>();
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState<PurchaseOrderFilterValues>(
    DEFAULT_PURCHASE_ORDER_FILTER_VALUES,
  );
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedDeleteOrder, setSelectedDeleteOrder] =
    useState<PurchaseOrderRow>();

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
    (data: OrderFormValues) => {
      console.log("Submit purchase order", data);
      handleCloseOrderModal();
    },
    [handleCloseOrderModal],
  );

  const handleEditOrder = useCallback((record: PurchaseOrderRow) => {
    setSelectedOrder({
      orderDate: record.orderDate,
      status: record.status,
      note: record.note,
      items: record.items.map((item) => ({
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

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

  const handleConfirmDelete = useCallback(() => {
    console.log("Delete purchase order", selectedDeleteOrder);
    handleCloseDeleteModal();
  }, [handleCloseDeleteModal, selectedDeleteOrder]);

  // ===== Memos =====
  const filteredPurchaseOrders = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return purchaseOrders.filter((order) => {
      const searchableText = [order.poNumber, order.note]
        .join(" ")
        .toLowerCase();

      const isMatchedSearch = normalizedSearchValue
        ? searchableText.includes(normalizedSearchValue)
        : true;

      const isMatchedStatus =
        !filterValues.status ||
        filterValues.status === "all" ||
        order.status === filterValues.status;

      const isMatchedFromDate = filterValues.fromDate
        ? new Date(order.orderDate) >= new Date(filterValues.fromDate)
        : true;

      const isMatchedToDate = filterValues.toDate
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

  const purchaseOrderColumns = useMemo((): ColumnType<PurchaseOrderRow>[] => {
    return [
      {
        title: t("orders.po_number"),
        dataIndex: "poNumber",
        key: "poNumber",
        tooltip: true,
      },
      {
        title: t("orders.order_date"),
        dataIndex: "orderDate",
        key: "orderDate",
        tooltip: true,
      },
      {
        title: t("orders.total_items"),
        key: "totalItems",
        tooltip: true,
        render: (_, record) => getPurchaseOrderTotalItems(record.items),
      },
      {
        title: t("orders.total_quantity"),
        key: "totalQuantity",
        tooltip: true,
        render: (_, record) => getPurchaseOrderTotalQuantity(record.items),
      },
      {
        title: t("orders.total_amount"),
        key: "totalAmount",
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
        title: t("orders.note"),
        key: "note",
        width: 300,
        tooltip: true,
        render: (_, record) => <p className={cx("noteCell")}>{record.note}</p>,
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
              widthPanel={500}
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
                          options={PURCHASE_ORDER_STATUS_OPTIONS}
                          height={40}
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
                            height={40}
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
                            height={40}
                            onChange={(event) => {
                              onChange({
                                name: "toDate",
                                value: event.target.value,
                              });
                            }}
                          />
                        </div>

                        {getIsApplyDisabled(valueFilter, isChecked) && (
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
        <BaseTable
          columns={purchaseOrderColumns}
          dataSource={filteredPurchaseOrders}
          onClickRow={handleOpenOrderDetail}
        />
      </div>

      <BasePagination
        currentPage={1}
        totalItems={filteredPurchaseOrders.length}
        totalPages={1}
        onChange={() => undefined}
      />

      <OrdersFormModal
        isOpen={isOpenOrderModal}
        initialValues={selectedOrder}
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
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default OrdersPage;
