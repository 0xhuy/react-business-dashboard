import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t } = useTranslation();

  return <div>{t("settings.title")}</div>;
};

export default SettingsPage;
