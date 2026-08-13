// ===== Libs =====
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames/bind";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";

// ===== Components =====
import {
  BaseButton,
  BaseInput,
  BaseModal,
  BaseSelect,
  BaseTextarea,
} from "@/components";

// ===== Others =====
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { EMPTY_STRING } from "@/utils/constants";
import { getCurrencyFormatter } from "@/utils/helper";
import {
  DEFAULT_ORDER_FORM_VALUES,
  ORDER_STATUS_OPTIONS,
} from "@/utils/constants/orders.constants";
import { orderFormSchema } from "./OrdersForm.schema";
import type { OrderFormModalProps, OrderFormValues } from "./types";
import { useProducts } from "@/redux/hooks";

// ===== Styles =====
import styles from "./OrdersFormModal.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const OrdersFormModal = (props: OrderFormModalProps) => {
  // ===== Props =====
  const { isOpen, isLoading = false, initialValues, onClose, onSubmit } = props;

  // ===== Hooks =====
  const { t, i18n } = useTranslation();
  const { products } = useProducts();
  const currencyFormatter = getCurrencyFormatter(i18n.language);
  const schema = orderFormSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<OrderFormValues>({
    mode: "onChange",
    resolver: zodResolver(schema) as Resolver<OrderFormValues>,
    defaultValues: initialValues || DEFAULT_ORDER_FORM_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // ===== Memos =====
  const orderItems = useWatch({
    control,
    name: "items",
  });

  const summary = useMemo(() => {
    return orderItems.reduce(
      (result, item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;

        return {
          totalItems: result.totalItems + 1,
          totalQuantity: result.totalQuantity + quantity,
          totalAmount: result.totalAmount + quantity * unitPrice,
        };
      },
      {
        totalItems: 0,
        totalQuantity: 0,
        totalAmount: 0,
      },
    );
  }, [orderItems]);

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: `${product.name} (${product.sku})`,
        value: product.sku,
      })),
    [products],
  );

  // ===== Effects =====
  useEffect(() => {
    reset(initialValues || DEFAULT_ORDER_FORM_VALUES);
  }, [initialValues, reset]);

  // ===== Handlers =====
  const handleClose = useCallback(() => {
    reset(initialValues || DEFAULT_ORDER_FORM_VALUES);
    onClose();
  }, [initialValues, onClose, reset]);

  const handleAddProduct = useCallback(() => {
    append({
      productSku: EMPTY_STRING,
      quantity: 1,
      unitPrice: 0,
    });
  }, [append]);

  const handleSubmitForm = useCallback(
    (values: OrderFormValues) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <BaseModal
      isOpen={isOpen}
      title={
        initialValues ? t("orders.edit_order") : t("orders.add_purchase_order")
      }
      width={920}
      isLoading={isLoading}
      onClose={handleClose}
      footer={
        <>
          <BaseButton
            variant="outline"
            size="sm"
            isStatic
            isDisabled={isLoading}
            className={cx("footerButton")}
            onClick={handleClose}
          >
            {t("common.btn_cancel")}
          </BaseButton>

          <BaseButton
            type="submit"
            form="orderForm"
            size="sm"
            isStatic
            isLoading={isLoading}
            isDisabled={!isValid}
            className={cx("footerButton")}
          >
            {t("common.btn_save")}
          </BaseButton>
        </>
      }
    >
      <form
        id="orderForm"
        className={cx("form")}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <section className={cx("section")}>
          <p className={cx("sectionTitle")}>{t("orders.order_information")}</p>

          <div className={cx("twoColumns")}>
            <Controller
              name="supplier"
              control={control}
              render={({ field }) => (
                <BaseInput
                  {...field}
                  label={t("orders.supplier")}
                  placeholder={t("orders.supplier_placeholder")}
                  messageError={errors.supplier?.message}
                  isRequired
                />
              )}
            />

            <Controller
              name="orderDate"
              control={control}
              render={({ field }) => (
                <BaseInput
                  {...field}
                  type={InputTypeEnum.DATE}
                  label={t("orders.order_date")}
                  placeholder={t("orders.select_order_date")}
                  messageError={errors.orderDate?.message}
                  isRequired
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  name={field.name}
                  label={t("orders.status")}
                  value={field.value}
                  options={ORDER_STATUS_OPTIONS}
                  placeholder={t("orders.select_status")}
                  errorMessage={errors.status?.message}
                  onChange={({ value }) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>

          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <BaseTextarea
                label={t("orders.note")}
                value={field.value}
                placeholder={t("orders.placeholder_note")}
                onTextareaChange={field.onChange}
                errorMessage={errors.note?.message}
                height={100}
              />
            )}
          />
        </section>

        <section className={cx("section")}>
          <div className={cx("sectionHeader")}>
            <div>
              <p className={cx("sectionTitle")}>{t("orders.product_list")}</p>
              <p className={cx("sectionDescription")}>
                {t("orders.product_list_description")}
              </p>
            </div>

            <BaseButton
              isStatic
              variant="outline"
              size="sm"
              type="button"
              className={cx("addProductButton")}
              onClick={handleAddProduct}
            >
              {t("orders.add_product")}
            </BaseButton>
          </div>

          <div className={cx("itemsTable")}>
            <div className={cx("itemsHeader")}>
              <p>{t("orders.product")}</p>
              <p>{t("orders.quantity")}</p>
              <p>{t("orders.unit_price")}</p>
              <p>{t("orders.total")}</p>
              <p />
            </div>

            <div className={cx("itemsBody")}>
              {fields.map((field, index) => {
                const item = orderItems[index];
                const quantity = Number(item?.quantity) || 0;
                const unitPrice = Number(item?.unitPrice) || 0;
                const itemTotal = quantity * unitPrice;

                return (
                  <div className={cx("itemRow")} key={field.id}>
                    <Controller
                      name={`items.${index}.productSku`}
                      control={control}
                      render={({ field }) => (
                        <BaseSelect
                          name={field.name}
                          value={field.value}
                          options={productOptions}
                          placeholder={t("orders.select_product")}
                          errorMessage={
                            errors.items?.[index]?.productSku?.message
                          }
                          onChange={(option) => {
                            const selectedProduct = products.find(
                              (product) => product.sku === option.value,
                            );

                            field.onChange(option.value);

                            setValue(
                              `items.${index}.unitPrice`,
                              selectedProduct?.price ?? 0,
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                          }}
                        />
                      )}
                    />

                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <BaseInput
                          {...field}
                          type={InputTypeEnum.NUMBER}
                          placeholder={t("orders.quantity_placeholder")}
                          messageError={
                            errors.items?.[index]?.quantity?.message
                          }
                        />
                      )}
                    />

                    <Controller
                      name={`items.${index}.unitPrice`}
                      control={control}
                      render={({ field }) => (
                        <BaseInput
                          {...field}
                          type={InputTypeEnum.NUMBER}
                          placeholder={t("orders.unit_price_placeholder")}
                          messageError={
                            errors.items?.[index]?.unitPrice?.message
                          }
                        />
                      )}
                    />

                    <p className={cx("itemTotal")}>
                      {currencyFormatter.format(itemTotal)}
                    </p>

                    <BaseButton
                      isStatic
                      type="button"
                      variant="outline"
                      size="sm"
                      isDisabled={fields.length === 1}
                      className={cx("deleteItemButton")}
                      onClick={() => remove(index)}
                    >
                      {t("common.btn_delete")}
                    </BaseButton>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={cx("summary")}>
          <p className={cx("sectionTitle")}>{t("orders.summary")}</p>

          <div className={cx("summaryCard")}>
            <div className={cx("summaryRow")}>
              <span>{t("orders.total_items")}</span>
              <strong>{summary.totalItems}</strong>
            </div>

            <div className={cx("summaryRow")}>
              <span>{t("orders.total_quantity")}</span>
              <strong>{summary.totalQuantity}</strong>
            </div>

            <div className={cx("summaryRow", "summaryTotalRow")}>
              <span>{t("orders.total_amount")}</span>
              <strong>{currencyFormatter.format(summary.totalAmount)}</strong>
            </div>
          </div>
        </section>
      </form>
    </BaseModal>
  );
};

export default OrdersFormModal;
