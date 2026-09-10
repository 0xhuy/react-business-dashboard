// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ===== Components =====
import UsersFormModal from "./components/UsersFormModal/UsersFormModal";
import {
  BaseActionMenu,
  BaseButton,
  BaseCheckbox,
  BaseFilter,
  BaseInput,
  BaseLoading,
  BaseSelect,
  BaseTable,
  BaseToast,
} from "@/components";

// ===== Others =====
import type { ColumnType } from "@/utils/interfaces";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { KeyTableEnum } from "@/utils/enum";
import { icons } from "@/assets";
import type {
  UserFilterValues,
  UserFormValues,
  UserRow,
} from "@/features/users/user.types";
import {
  DEFAULT_FILTER_PANEL_WIDTH,
  DEFAULT_FILTER_SELECT_HEIGHT,
  DEFAULT_USER_FILTER_VALUES,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  EMPTY_STRING,
} from "@/utils/constants";
import { useAppDispatch, useAuth, useUsers } from "@/redux/hooks";
import { getUsersThunk, updateUserThunk } from "@/redux/thunks/users/userThunk";

// ===== Styles =====
import styles from "./UsersPage.module.scss";
import { getErrorMessage } from "@/utils/errors";

const cx = classNames.bind(styles);

const UsersPage = () => {
  // ===== Hooks =====
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const { users, loading: isLoading, isProcessing } = useUsers();

  // ===== States =====
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow>();
  const [searchValue, setSearchValue] = useState("");

  const [filterValues, setFilterValues] = useState<UserFilterValues>(
    DEFAULT_USER_FILTER_VALUES,
  );

  const [apiError, setApiError] = useState(EMPTY_STRING);
  const [apiMessage, setApiMessage] = useState(EMPTY_STRING);

  // ===== Effects =====
  useEffect(() => {
    void dispatch(getUsersThunk())
      .unwrap()
      .catch((error) => {
        console.error("Unable to load users:", error);
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

  const handleOpenUserDetail = useCallback(
    (record: UserRow) => {
      navigate(record.id);
    },
    [navigate],
  );

  const handleApplyFilter = useCallback((valueFilter: UserFilterValues) => {
    setFilterValues(valueFilter);
  }, []);

  const handleCloseUserModal = useCallback(() => {
    setSelectedUser(undefined);
    setIsOpenUserModal(false);
  }, []);

  const handleSubmitUser = useCallback(
    async (data: UserFormValues) => {
      if (!selectedUser) return;

      setApiError(EMPTY_STRING);
      setApiMessage(EMPTY_STRING);
      const isEditingCurrentUser = selectedUser.id === currentUser?.id;

      const user = {
        fullName: data.fullName,
        email: selectedUser.email,
        role: isEditingCurrentUser ? selectedUser.role : data.role,
        status: isEditingCurrentUser ? selectedUser.status : data.status,
      };

      try {
        await dispatch(updateUserThunk({ id: selectedUser.id, user })).unwrap();
        setApiMessage(t("users.api.update_success"));

        handleCloseUserModal();
      } catch (error) {
        console.error("Unable to save user:", error);
        setApiError(getErrorMessage(error, t));
      }
    },
    [currentUser?.id, dispatch, handleCloseUserModal, selectedUser, t],
  );

  const handleEditUser = useCallback((record: UserRow) => {
    setSelectedUser(record);
    setIsOpenUserModal(true);
  }, []);

  const handleToggleUserStatus = useCallback(
    async (record: UserRow) => {
      if (record.id === currentUser?.id) return;

      try {
        await dispatch(
          updateUserThunk({
            id: record.id,
            user: {
              fullName: record.fullName,
              email: record.email,
              role: record.role,
              status: record.status === "Active" ? "Inactive" : "Active",
            },
          }),
        ).unwrap();
        setApiMessage(t("users.api.status_success"));
      } catch (error) {
        console.error("Unable to update user status:", error);
        setApiError(getErrorMessage(error, t));
      }
    },
    [currentUser?.id, dispatch, t],
  );

  // ===== Memos =====
  const filteredUsers = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [user.id, user.fullName, user.email]
        .join(" ")
        .toLocaleLowerCase();

      const isMatchedSearch = normalizedSearchValue
        ? searchableText.includes(normalizedSearchValue)
        : true;

      const isMatchedRole =
        !filterValues.role ||
        filterValues.role === "all" ||
        user.role === filterValues.role;

      const isMatchedStatus =
        !filterValues.status ||
        filterValues.status === "all" ||
        user.status === filterValues.status;

      return isMatchedSearch && isMatchedRole && isMatchedStatus;
    });
  }, [filterValues, searchValue, users]);

  const userRoleOptions = useMemo(
    () =>
      USER_ROLE_OPTIONS.map((option) => ({
        ...option,
        label:
          option.value === "all"
            ? t("users.role_all")
            : t(`users.role_${option.value.toLowerCase()}`),
      })),
    [t],
  );

  const userStatusOptions = useMemo(
    () =>
      USER_STATUS_OPTIONS.map((option) => ({
        ...option,
        label:
          option.value === "all"
            ? t("users.status_all")
            : t(`users.status_${option.value.toLowerCase()}`),
      })),
    [t],
  );

  const userFormInitialValues = useMemo(() => {
    if (!selectedUser) return undefined;

    return {
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      role: selectedUser.role,
      status: selectedUser.status,
    };
  }, [selectedUser]);

  const userColumns = useMemo((): ColumnType<UserRow>[] => {
    return [
      {
        title: t("users.full_name"),
        dataIndex: "fullName",
        key: "fullName",
        tooltip: true,
      },
      {
        title: t("users.email"),
        dataIndex: "email",
        key: "email",
        tooltip: true,
      },
      {
        title: t("users.role"),
        dataIndex: "role",
        key: "role",
        tooltip: true,
        render: (_, record) => t(`users.role_${record.role.toLowerCase()}`),
      },
      {
        title: t("users.status"),
        dataIndex: "status",
        key: "status",
        tooltip: true,
        render: (_, record) => (
          <span
            className={cx("status", {
              statusActive: record.status === "Active",
              statusInactive: record.status === "Inactive",
            })}
          >
            {t(`users.status_${record.status.toLowerCase()}`)}
          </span>
        ),
      },
      {
        title: t("users.created_at"),
        dataIndex: "createdAt",
        key: "createdAt",
        tooltip: true,
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
                  onClick: () => handleOpenUserDetail(record),
                },
                {
                  icon: icons.iconEdit,
                  label: t("common.btn_edit"),
                  onClick: () => handleEditUser(record),
                },
                ...(record.id === currentUser?.id
                  ? []
                  : [
                      {
                        icon:
                          record.status === "Active"
                            ? icons.iconDeactivate
                            : icons.iconActivate,
                        label:
                          record.status === "Active"
                            ? t("users.deactivate")
                            : t("users.activate"),
                        onClick: () => handleToggleUserStatus(record),
                      },
                      {
                        icon: icons.iconTrash,
                        label: t("common.btn_delete"),
                        variant: "danger" as const,
                        isDisabled: true,
                        onClick: () => undefined,
                      },
                    ]),
              ]}
            />
          </div>
        ),
      },
    ];
  }, [
    currentUser?.id,
    handleEditUser,
    handleOpenUserDetail,
    handleToggleUserStatus,
    t,
  ]);

  return (
    <div className={cx("wrapper")}>
      <p className={cx("backendNotice")}>{t("users.backend_notice")}</p>

      <section className={cx("toolbarCard")}>
        <div className={cx("toolbarHeader")}>
          <p className={cx("pageTitle")}>
            {t("users.title")}: {filteredUsers.length}
          </p>

          <div className={cx("toolbarActions")}>
            <BaseInput
              type={InputTypeEnum.TEXT}
              height={45}
              borderRadius={12}
              placeholder={t("users.search_placeholder")}
              className={cx("searchInput")}
              value={searchValue}
              onChange={handleSearchChange}
            />

            <BaseFilter<UserFilterValues>
              valueFilter={filterValues}
              defaultValue={DEFAULT_USER_FILTER_VALUES}
              widthPanel={DEFAULT_FILTER_PANEL_WIDTH}
              onApply={handleApplyFilter}
            >
              {({ valueFilter, isChecked, onCheckboxChange, onChange }) => (
                <div className={cx("filterContainer")}>
                  <div className={cx("filterGroup")}>
                    <BaseCheckbox
                      name="role"
                      label={t("users.role")}
                      value={!!isChecked?.role}
                      onChange={(checked: boolean) => {
                        onCheckboxChange("role", checked);
                      }}
                    />

                    {isChecked?.role && (
                      <div className={cx("contentFilterWrap")}>
                        <BaseSelect
                          name="role"
                          options={userRoleOptions}
                          height={DEFAULT_FILTER_SELECT_HEIGHT}
                          value={valueFilter.role}
                          placeholder={t("users.role")}
                          onChange={({ value }, name) => {
                            onChange({
                              name: name as keyof UserFilterValues,
                              value: value as UserFilterValues["role"],
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className={cx("filterGroup")}>
                    <BaseCheckbox
                      name="status"
                      label={t("users.status")}
                      value={!!isChecked?.status}
                      onChange={(checked: boolean) => {
                        onCheckboxChange("status", checked);
                      }}
                    />

                    {isChecked?.status && (
                      <div className={cx("contentFilterWrap")}>
                        <BaseSelect
                          name="status"
                          options={userStatusOptions}
                          height={DEFAULT_FILTER_SELECT_HEIGHT}
                          value={valueFilter.status}
                          placeholder={t("users.status")}
                          onChange={({ value }, name) => {
                            onChange({
                              name: name as keyof UserFilterValues,
                              value: value as UserFilterValues["status"],
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </BaseFilter>

            <BaseButton isStatic isDisabled className={cx("addButton")}>
              {t("users.add_user")}
            </BaseButton>
          </div>
        </div>
      </section>

      <div className={cx("table")}>
        {isLoading ? (
          <BaseLoading />
        ) : (
          <BaseTable
            columns={userColumns}
            dataSource={filteredUsers}
            onClickRow={handleOpenUserDetail}
          />
        )}
      </div>

      <UsersFormModal
        isOpen={isOpenUserModal}
        isLoading={isProcessing}
        isCurrentUser={
          Boolean(selectedUser) && selectedUser?.id === currentUser?.id
        }
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

export default UsersPage;
