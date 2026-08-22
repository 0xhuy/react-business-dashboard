// ===== Libs =====
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames/bind";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";

// ===== Components =====
import { BaseButton, BaseInput, BaseModal, BaseSelect } from "@/components";

// ===== Others =====
import { InputTypeEnum } from "@/utils/enum/input.enum";
import {
  DEFAULT_USER_FORM_VALUES,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/utils/constants/user.constants";
import { createUserFormSchema } from "./UsersForm.schema";
import type { UserFormValues } from "@/features/users/user.types";
import type { UserFormModalProps } from "./types";

// ===== Styles =====
import styles from "./UsersFormModal.module.scss";
import { icons } from "@/assets";

const cx = classNames.bind(styles);

const getUserFormValues = (
  initialValues: UserFormModalProps["initialValues"],
): UserFormValues => ({
  ...DEFAULT_USER_FORM_VALUES,
  ...initialValues,
});

// ===== Component =====
const UsersFormModal = (props: UserFormModalProps) => {
  // ===== Props =====
  const {
    isOpen,
    isLoading = false,
    isCurrentUser = false,
    initialValues,
    onClose,
    onSubmit,
  } = props;

  // ===== Hooks =====
  const { t } = useTranslation();
  const isEditMode = Boolean(initialValues);
  const schema = createUserFormSchema(t, isEditMode);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    mode: "onChange",
    resolver: zodResolver(schema) as Resolver<UserFormValues>,
    defaultValues: getUserFormValues(initialValues),
  });

  // ===== Effects =====
  useEffect(() => {
    reset(getUserFormValues(initialValues));
  }, [initialValues, isOpen, reset]);

  // ===== Handlers =====
  const handleClose = useCallback(() => {
    reset(getUserFormValues(initialValues));
    onClose();
  }, [initialValues, onClose, reset]);

  const handleSubmitForm = useCallback(
    (values: UserFormValues) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <BaseModal
      isOpen={isOpen}
      title={isEditMode ? t("users.edit_user") : t("users.add_user")}
      width={680}
      isLoading={isLoading}
      onClose={handleClose}
      footer={
        <>
          <BaseButton variant="outline" isStatic onClick={handleClose}>
            {t("common.btn_cancel")}
          </BaseButton>

          <BaseButton
            type="submit"
            form="userForm"
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
        id="userForm"
        className={cx("form")}
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <section className={cx("section")}>
          <p className={cx("sectionTitle")}>{t("users.user_information")}</p>

          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <BaseInput
                {...field}
                label={t("users.full_name")}
                placeholder={t("users.full_name_placeholder")}
                messageError={errors.fullName?.message}
                isRequired
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <BaseInput
                {...field}
                type={InputTypeEnum.EMAIL}
                disabled={isEditMode}
                label={t("users.email")}
                placeholder={t("users.email_placeholder")}
                messageError={errors.email?.message}
                isRequired
              />
            )}
          />

          <div className={cx("twoColumns")}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  name={field.name}
                  disabled={isCurrentUser}
                  label={t("users.role")}
                  value={field.value}
                  options={USER_ROLE_OPTIONS.filter(
                    (option) => option.value !== "all",
                  )}
                  placeholder={t("users.select_role")}
                  errorMessage={errors.role?.message}
                  onChange={({ value }) => {
                    field.onChange(value as UserFormValues["role"]);
                  }}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  name={field.name}
                  disabled={isCurrentUser}
                  label={t("users.status")}
                  value={field.value}
                  options={USER_STATUS_OPTIONS.filter(
                    (option) => option.value !== "all",
                  )}
                  placeholder={t("users.select_status")}
                  errorMessage={errors.status?.message}
                  onChange={({ value }) => {
                    field.onChange(value as UserFormValues["status"]);
                  }}
                />
              )}
            />
          </div>
        </section>

        {!isCurrentUser && <section className={cx("section")}>
          <p className={cx("sectionTitle")}>{t("users.security")}</p>

          <div className={cx("twoColumns")}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <BaseInput
                  {...field}
                  value={field.value ?? ""}
                  type={InputTypeEnum.PASSWORD}
                  disabled={isEditMode}
                  label={t("users.password")}
                  placeholder={t("users.password_placeholder")}
                  messageError={errors.password?.message}
                  isRequired={!isEditMode}
                  renderPasswordToggle={(isShow) => (
                    <img
                      className={cx("toggleIcon")}
                      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                      alt={
                        isShow
                          ? t("auth.login.hide_password")
                          : t("auth.login.show_password")
                      }
                    />
                  )}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <BaseInput
                  {...field}
                  value={field.value ?? ""}
                  type={InputTypeEnum.PASSWORD}
                  disabled={isEditMode}
                  label={t("users.confirm_password")}
                  placeholder={t("users.confirm_password_placeholder")}
                  messageError={errors.confirmPassword?.message}
                  isRequired={!isEditMode}
                  renderPasswordToggle={(isShow) => (
                    <img
                      className={cx("toggleIcon")}
                      src={isShow ? icons.iconEyeOff : icons.iconEyeShow}
                      alt={
                        isShow
                          ? t("auth.login.hide_password")
                          : t("auth.login.show_password")
                      }
                    />
                  )}
                />
              )}
            />
          </div>
        </section>}
      </form>
    </BaseModal>
  );
};

export default UsersFormModal;
