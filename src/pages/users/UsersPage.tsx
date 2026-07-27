// ===== Libs =====
import classNames from "classnames/bind";
import { useCallback, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ===== Components =====
import UsersFormModal from "./components/UsersFormModal/UsersFormModal";
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
import type { UserFormValues } from "./components/UsersFormModal/types";
import type { ColumnType } from "@/utils/interfaces";
import { InputTypeEnum } from "@/utils/enum/input.enum";
import { KeyTableEnum } from "@/utils/enum";
import { icons } from "@/assets";
import type { UserFilterValues, UserRow } from "./type";
import {
  DEFAULT_USER_FILTER_VALUES,
  USER_DATA_SOURCE,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/utils/constants";

// ===== Styles =====
import styles from "./UsersPage.module.scss";

const cx = classNames.bind(styles);

const UsersPage = () => {
  // ===== Hooks =====
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ===== States =====
  const [users, setUsers] = useState<UserRow[]>(USER_DATA_SOURCE);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow>();
  const [searchValue, setSearchValue] = useState("");

  const [filterValues, setFilterValues] = useState<UserFilterValues>(
    DEFAULT_USER_FILTER_VALUES,
  );

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<UserRow>();

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

  const handleOpenUserModal = useCallback(() => {
    setSelectedUser(undefined);
    setIsOpenUserModal(true);
  }, []);

  const handleCloseUserModal = useCallback(() => {
    setSelectedUser(undefined);
    setIsOpenUserModal(false);
  }, []);

  const handleSubmitUser = useCallback(
    (data: UserFormValues) => {
      if (selectedUser) {
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  fullName: data.fullName,
                  email: data.email,
                  role: data.role,
                  status: data.status,
                }
              : user,
          ),
        );
      } else {
        setUsers((currentUsers) => [
          ...currentUsers,
          {
            id: `USR-${String(currentUsers.length + 1).padStart(3, "0")}`,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            status: data.status,
            createdAt: new Date().toISOString().slice(0, 10),
          },
        ]);
      }

      handleCloseUserModal();
    },
    [handleCloseUserModal, selectedUser],
  );

  const handleEditUser = useCallback((record: UserRow) => {
    setSelectedUser(record);
    setIsOpenUserModal(true);
  }, []);

  const handleToggleUserStatus = useCallback((record: UserRow) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === record.id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user,
      ),
    );
  }, []);

  const handleDeleteUser = useCallback((record: UserRow) => {
    setSelectedDeleteUser(record);
    setIsOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setSelectedDeleteUser(undefined);
    setIsOpenDeleteModal(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedDeleteUser) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== selectedDeleteUser.id),
    );

    handleCloseDeleteModal();
  }, [handleCloseDeleteModal, selectedDeleteUser]);

  // ===== Memos =====
  const filteredUsers = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [
        user.id,
        user.fullName,
        user.email,
      ]
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
                  icon: icons.iconEdit,
                  label: t("common.btn_edit"),
                  onClick: () => handleEditUser(record),
                },
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
                  variant: "danger",
                  onClick: () => handleDeleteUser(record),
                },
              ]}
            />
          </div>
        ),
      },
    ];
  }, [handleDeleteUser, handleEditUser, handleToggleUserStatus, t]);

  return (
    <div className={cx("wrapper")}>
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
              widthPanel={500}
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
                          height={40}
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
                          height={40}
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

            <BaseButton
              isStatic
              onClick={handleOpenUserModal}
              className={cx("addButton")}
            >
              {t("users.add_user")}
            </BaseButton>
          </div>
        </div>
      </section>

      <div className={cx("table")}>
        <BaseTable
          columns={userColumns}
          dataSource={filteredUsers}
          onClickRow={handleOpenUserDetail}
        />
      </div>

      <BasePagination
        currentPage={1}
        totalItems={filteredUsers.length}
        totalPages={1}
        onChange={() => undefined}
      />

      <UsersFormModal
        isOpen={isOpenUserModal}
        initialValues={
          selectedUser
            ? {
                fullName: selectedUser.fullName,
                email: selectedUser.email,
                role: selectedUser.role,
                status: selectedUser.status,
              }
            : undefined
        }
        onClose={handleCloseUserModal}
        onSubmit={handleSubmitUser}
      />

      <BaseConfirmModal
        isOpen={isOpenDeleteModal}
        title={t("common.confirm_delete")}
        description={
          <Trans
            i18nKey="common.delete_description"
            values={{
              value: selectedDeleteUser?.fullName,
            }}
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

export default UsersPage;
