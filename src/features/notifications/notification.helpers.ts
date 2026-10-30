import type { NotificationDateGroup } from "./notification.types";
import { NOTIFICATION_DATE_GROUP } from "@/utils/constants";

const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY = 86_400_000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

const getCalendarDayIndex = (timestamp: number): number => {
  const date = new Date(timestamp);
  const calendarDay = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return Math.floor(calendarDay / MILLISECONDS_PER_DAY);
};

const getElapsedCalendarDays = (
  createdTime: number,
  currentTime: number,
): number =>
  Math.max(
    0,
    getCalendarDayIndex(currentTime) - getCalendarDayIndex(createdTime),
  );

export const getNotificationDateGroup = (
  createdAt: string,
  currentTime: number,
): NotificationDateGroup => {
  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) {
    return NOTIFICATION_DATE_GROUP.EARLIER;
  }

  const elapsedDays = getElapsedCalendarDays(createdTime, currentTime);

  if (elapsedDays === 0) return NOTIFICATION_DATE_GROUP.TODAY;
  if (elapsedDays === 1) {
    return NOTIFICATION_DATE_GROUP.YESTERDAY;
  }

  return NOTIFICATION_DATE_GROUP.EARLIER;
};

export const formatNotificationTime = (
  createdAt: string,
  language: string,
  currentTime: number,
): string => {
  const createdTime = new Date(createdAt).getTime();

  if (!Number.isFinite(createdTime)) return "";

  const elapsedSeconds = Math.max(
    0,
    Math.floor((currentTime - createdTime) / MILLISECONDS_PER_SECOND),
  );
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  const elapsedDays = getElapsedCalendarDays(createdTime, currentTime);

  if (elapsedDays > 0) {
    return formatter.format(-elapsedDays, "day");
  }

  if (elapsedSeconds < SECONDS_PER_MINUTE) {
    return formatter.format(0, "second");
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / SECONDS_PER_MINUTE);

  if (elapsedMinutes < MINUTES_PER_HOUR) {
    return formatter.format(-elapsedMinutes, "minute");
  }

  const elapsedHours = Math.floor(elapsedMinutes / MINUTES_PER_HOUR);

  return formatter.format(-elapsedHours, "hour");
};
