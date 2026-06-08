// ===== Libs =====
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames/bind";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useEffect } from "react";
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
import { productFormSchema } from "./ProductForm.schema";
import type { ProductFormModalProps, ProductFormValues } from "./types";

// ===== Styles =====
import styles from "./ProductFormModal.module.scss";

const cx = classNames.bind(styles);

const PRODUCT_CATEGORY_OPTIONS = [
  {
    label: "products.category_electronics",
    value: "Electronics",
  },
  {
    label: "products.category_furniture",
    value: "Furniture",
  },
  {
    label: "products.category_lifestyle",
    value: "Lifestyle",
  },
  {
    label: "products.category_stationery",
    value: "Stationery",
  },
];

const DEFAULT_PRODUCT_FORM_VALUES: ProductFormValues = {
  sku: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
};

// ===== Component =====
const ProductFormModal = (props: ProductFormModalProps) => {
  // ===== Props =====
  const { isOpen, isLoading = false, initialValues, onClose, onSubmit } = props;

  // ===== Hooks =====
  const { t } = useTranslation();

  const schema = productFormSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProductFormValues>({
    mode: "onChange",
    resolver: zodResolver(schema) as Resolver<ProductFormValues>,
    defaultValues: initialValues || DEFAULT_PRODUCT_FORM_VALUES,
  });

  // ===== Effects =====
  useEffect(() => {
    reset(initialValues || DEFAULT_PRODUCT_FORM_VALUES);
  }, [initialValues, reset]);

  // ===== Handlers =====
  const handleClose = () => {
    reset(initialValues || DEFAULT_PRODUCT_FORM_VALUES);
    onClose();
  };

  const handleSubmitForm = (values: ProductFormValues) => {
    onSubmit(values);
  };

  // ===== Render =====
  return (
    <BaseModal
      isOpen={isOpen}
      title={t(
        initialValues ? "products.edit_product" : "products.add_product",
      )}
      width={720}
      isLoading={isLoading}
      onClose={handleClose}
      footer={
        <>
          <BaseButton variant="outline" isStatic onClick={handleClose}>
            {t("common.btn_cancel")}
          </BaseButton>

          <BaseButton
            type="submit"
            form="productForm"
            isStatic
            isLoading={isLoading}
            isDisabled={!isValid}
          >
            {t("common.btn_save")}
          </BaseButton>
        </>
      }
    >
      <form
        id="productForm"
        className={cx("form")}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className={cx("twoColumns")}>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <BaseInput
                {...field}
                label={t("products.sku")}
                placeholder={t("products.placeholder_sku")}
                messageError={errors.sku?.message}
                isRequired
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <BaseInput
                {...field}
                label={t("products.name")}
                placeholder={t("products.placeholder_name")}
                messageError={errors.name?.message}
                isRequired
              />
            )}
          />
        </div>

        <div className={cx("twoColumns")}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <BaseSelect
                name={field.name}
                label={t("products.category")}
                value={field.value}
                options={PRODUCT_CATEGORY_OPTIONS}
                placeholder={t("products.placeholder_category")}
                errorMessage={errors.category?.message}
                isRequired
                onChange={({ value }) => {
                  field.onChange(value);
                }}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <BaseInput
                {...field}
                type={InputTypeEnum.NUMBER}
                label={t("products.price")}
                placeholder={t("products.placeholder_price")}
                messageError={errors.price?.message}
                isRequired
              />
            )}
          />
        </div>

        <Controller
          name="stock"
          control={control}
          render={({ field }) => (
            <BaseInput
              {...field}
              type={InputTypeEnum.NUMBER}
              label={t("products.stock")}
              placeholder={t("products.placeholder_stock")}
              messageError={errors.stock?.message}
              isRequired
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <BaseTextarea
              label={t("products.description")}
              value={field.value}
              placeholder={t("products.placeholder_description")}
              onTextareaChange={field.onChange}
              errorMessage={errors.description?.message}
              isRequired
              height={120}
            />
          )}
        />
      </form>
    </BaseModal>
  );
};

export default ProductFormModal;
