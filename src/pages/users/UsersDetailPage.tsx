// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// ===== Components =====
import { BaseButton, BaseModal } from "@/components";
import UsersFormModal from "./components/UsersFormModal/UsersFormModal";

// ===== Others =====
import type {
  UserFormInitialValues,
  UserFormValues,
} from "./components/UsersFormModal/types";
import { USER_DATA_SOURCE } from "@/utils/constants/user.constants";
import { IconArrow } from "@/assets";

// ===== Styles =====
import styles from "./UsersDetailPage.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const UsersDetailPage = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  // ===== States =====
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  // ===== Memos =====
  const user = useMemo(() => {
    return USER_DATA_SOURCE.find((item) => item.id === id);
  }, [id]);

  const userFormInitialValues = useMemo<UserFormInitialValues | undefined>(() => {
    if (!user) return undefined;

    return {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }, [user]);

  // ===== Handlers =====
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEditUser = useCallback(() => {
    setIsOpenUserModal(true);
  }, []);

  const handleCloseUserModal = useCallback(() => {
    setIsOpenUserModal(false);
  }, []);

  const handleSubmitUser = useCallback(
    (data: UserFormValues) => {
      console.log("Submit user:", data);
      handleCloseUserModal();
    },
    [handleCloseUserModal],
  );

  const handleDeleteUser = useCallback(() => {
    setIsOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsOpenDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    console.log("Delete user:", user);

    handleCloseDeleteModal();
    navigate(-1);
  }, [handleCloseDeleteModal, navigate, user]);

  // ===== Render not found =====
  if (!user) {
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

              {t("users.title")}
            </button>

            <p className={cx("detailTitle")}>{t("users.not_found")}</p>
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

              {t("users.title")}
            </button>

            <div className={cx("detailTitleWrap")}>
              <p className={cx("detailTitle")}>{user.fullName}</p>

              <span
                className={cx("status", {
                  statusActive: user.status === "Active",
                  statusInactive: user.status === "Inactive",
                })}
              >
                {t(`users.status_${user.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          <div className={cx("detailActions")}>
            <BaseButton
              variant="outline"
              isStatic
              className={cx("actionButton")}
              onClick={handleEditUser}
            >
              {t("common.btn_edit")}
            </BaseButton>

            <BaseButton
              variant="danger"
              isStatic
              className={cx("actionButton")}
              onClick={handleDeleteUser}
            >
              {t("common.btn_delete")}
            </BaseButton>
          </div>
        </div>

        <div className={cx("detailSummaryGrid")}>
          <div className={cx("detailSummaryItem")}>
            <span>{t("users.user_id")}</span>
            <p>{user.id}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("users.email")}</span>
            <p>{user.email}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("users.role")}</span>
            <p>{t(`users.role_${user.role.toLowerCase()}`)}</p>
          </div>

          <div className={cx("detailSummaryItem")}>
            <span>{t("users.created_at")}</span>
            <p>{user.createdAt}</p>
          </div>
        </div>
      </section>

      <section className={cx("detailContentGrid")}>
        <div className={cx("detailMain")}>
          <div className={cx("detailCard")}>
            <div className={cx("detailSectionHeader")}>
              <div>
                <p>{t("users.account_information")}</p>
                <span>{t("users.account_information_description")}</span>
              </div>
            </div>

            <div
              className={cx("detailInfoList", "accountInformationScroll")}
            >
              <div>
                <span>{t("users.full_name")}</span>
                <p>{user.fullName}</p>
              </div>

              <div>
                <span>{t("users.email")}</span>
                <p>{user.email}</p>
              </div>

              <div>
                <span>{t("users.role")}</span>
                <p>{t(`users.role_${user.role.toLowerCase()}`)}</p>
              </div>

              <div>
                <span>{t("users.status")}</span>
                <p>{t(`users.status_${user.status.toLowerCase()}`)}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className={cx("detailSidebar")}>
          <div className={cx("detailCard")}>
            <p className={cx("detailCardTitle")}>
              {t("users.user_information")}
            </p>

            <div className={cx("detailInfoList")}>
              <div>
                <span>{t("users.user_id")}</span>
                <p>{user.id}</p>
              </div>

              <div>
                <span>{t("users.created_at")}</span>
                <p>{user.createdAt}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <UsersFormModal
        isOpen={isOpenUserModal}
        initialValues={userFormInitialValues}
        onClose={handleCloseUserModal}
        onSubmit={handleSubmitUser}
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
          values={{ value: user.fullName }}
          components={[<strong key="strong" />]}
        />
      </BaseModal>
    </div>
  );
};

export default UsersDetailPage;
