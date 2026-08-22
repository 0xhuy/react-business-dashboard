// ===== Libs =====
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

// ===== Types =====
import type { DashboardChartItem } from "../types";

// ===== Styles =====
import styles from "../Dashboard.module.scss";

type Props = {
  title: string;
  description: string;
  data: DashboardChartItem[];
};

const cx = classNames.bind(styles);

const DashboardChart = ({ title, description, data }: Props) => {
  const { t } = useTranslation();
  const highestValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <article className={cx("panelCard")}>
      <div className={cx("panelHeader")}>
        <div>
          <h3 className={cx("panelTitle")}>{title}</h3>
          <p className={cx("panelDescription")}>{description}</p>
        </div>
      </div>

      {data.length ? (
        <div className={cx("barChart")}>
          {data.map((item) => (
            <div key={item.label} className={cx("chartItem")}>
              <span className={cx("chartValue")}>{item.value}</span>
              <span
                className={cx("chartBar")}
                style={{
                  height: `${Math.max((item.value / highestValue) * 100, 12)}%`,
                }}
              />
              <span className={cx("chartLabel")}>{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={cx("emptyState")}>{t("dashboard.no_chart_data")}</div>
      )}
    </article>
  );
};

export default DashboardChart;
