// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// ===== Components =====
import { BaseButton, BaseLoading, BaseToast } from "@/components";
import UsersFormModal from "./components/UsersFormModal/UsersFormModal";

// ===== Others =====
import type {
  UserFormInitialValues,
  UserFormValues,
} from "@/features/users/user.types";
import { EMPTY_STRING } from "@/utils/constants";
import { IconArrow } from "@/assets";
import { useAppDispatch, useAuth, useUsers } from "@/redux/hooks";
import { getUsersThunk, updateUserThunk } from "@/redux/thunks/users/userThunk";

// ===== Styles =====
import styles from "./UsersDetailPage.module.scss";

const cx = classNames.bind(styles);

// ===== Component =====
const UsersDetailPage = () => {
  // ===== Hooks =====
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const { users, loading: isLoading, isProcessing } = useUsers();

  // ===== States =====
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [apiError, setApiError] = useState(EMPTY_STRING);
  const [apiMessage, setApiMessage] = useState(EMPTY_STRING);

  // ===== Effects =====
  useEffect(() => {
    if (users.length > 0) return;

    void dispatch(getUsersThunk())
      .unwrap()
      .catch((error) => {
        console.error("Unable to load users:", error);
        setApiError(t("users.api.load_error"));
      });
  }, [dispatch, t, users.length]);

  // ===== Memos =====
  const user = useMemo(() => {
    return users.find((item) => item.id === id);
  }, [id, users]);

  const isCurrentUser = user?.id === currentUser?.id;

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
    async (data: UserFormValues) => {
      if (!user) return;

      try {
        await dispatch(
          updateUserThunk({
            id: user.id,
            user: {
              fullName: data.fullName,
              email: isCurrentUser ? user.email : data.email,
              role: isCurrentUser ? user.role : data.role,
              status: isCurrentUser ? user.status : data.status,
            },
          }),
        ).unwrap();
        setApiMessage(t("users.api.update_success"));
        handleCloseUserModal();
      } catch (error) {
        console.error("Unable to update user:", error);
        setApiError(t("users.api.save_error"));
      }
    },
    [dispatch, handleCloseUserModal, isCurrentUser, t, user],
  );

  const handleCopyUserId = useCallback(
    async (userId: string) => {
      try {
        await navigator.clipboard.writeText(userId);
        setApiMessage(t("users.user_id_copied"));
      } catch (error) {
        console.error("Unable to copy user ID:", error);
      }
    },
    [t],
  );

  if (isLoading) {
    return <BaseLoading variant="page" />;
  }

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
              <div className={cx("userAvatar")}>
                {user.fullName.trim().charAt(0).toUpperCase()}
              </div>

              <div className={cx("userIdentity")}>
                <p className={cx("detailTitle")}>{user.fullName}</p>
                <span className={cx("userEmail")}>{user.email}</span>
              </div>

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

            {!isCurrentUser && (
              <BaseButton
                variant="danger"
                isStatic
                isDisabled
                className={cx("actionButton")}
              >
                {t("common.btn_delete")}
              </BaseButton>
            )}
          </div>
        </div>

      </section>

      <section className={cx("detailContentGrid")}>
        <div className={cx("detailMain")}>
          <div className={cx("detailCard")}>
            <div className={cx("detailSectionHeader")}>
              <div>
                <p>{t("users.user_information")}</p>
                <span>{t("users.account_information_description")}</span>
              </div>
            </div>

            <div className={cx("informationSections")}>
              <section className={cx("informationSection")}>
                <p className={cx("informationSectionTitle")}>
                  {t("users.personal_information")}
                </p>

                <div className={cx("informationRows")}>
                  <div className={cx("informationRow")}>
                    <span>{t("users.full_name")}</span>
                    <p>{user.fullName}</p>
                  </div>

                  <div className={cx("informationRow")}>
                    <span>{t("users.email")}</span>
                    <p>{user.email}</p>
                  </div>
                </div>
              </section>

              <section className={cx("informationSection")}>
                <p className={cx("informationSectionTitle")}>
                  {t("users.access_permissions")}
                </p>

                <div className={cx("informationRows")}>
                  <div className={cx("informationRow")}>
                    <span>{t("users.role")}</span>
                    <p className={cx("roleBadge")}>
                      {t(`users.role_${user.role.toLowerCase()}`)}
                    </p>
                  </div>

                  <div className={cx("informationRow")}>
                    <span>{t("users.status")}</span>
                    <p
                      className={cx("status", {
                        statusActive: user.status === "Active",
                        statusInactive: user.status === "Inactive",
                      })}
                    >
                      {t(`users.status_${user.status.toLowerCase()}`)}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className={cx("metadataBar")}>
              <div className={cx("metadataItem", "metadataUserId")}>
                <span>{t("users.user_id")}</span>
                <div>
                  <p>{user.id}</p>
                  <button type="button" onClick={() => handleCopyUserId(user.id)}>
                    {t("users.copy")}
                  </button>
                </div>
              </div>

              <div className={cx("metadataItem")}>
                <span>{t("users.created_at")}</span>
                <p>{user.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UsersFormModal
        isOpen={isOpenUserModal}
        isLoading={isProcessing}
        isCurrentUser={isCurrentUser}
        initialValues={userFormInitialValues}
        onClose={handleCloseUserModal}
        onSubmit={handleSubmitUser}
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

export default UsersDetailPage;
