export type DateValue = Date | string;

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_NAMES_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Extracts year from a date (supports both Date objects and YYYY-MM strings)
 */
export function getYear(date: DateValue): string {
  if (typeof date === "string") {
    return date.split("-")[0];
  }
  return String(date.getFullYear());
}

/**
 * Formats a date for display
 * - For YYYY-MM strings: "Month Year" or "Mon Year"
 * - For Date objects: includes day if not the 1st of the month
 */
export function formatDate(
  date: DateValue,
  format: "short" | "long" = "short",
): string {
  if (typeof date === "string") {
    const [year, month] = date.split("-");
    const monthNames = format === "short" ? MONTH_NAMES_SHORT : MONTH_NAMES_LONG;
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }

  const day = date.getDate();
  if (day === 1) {
    return date.toLocaleDateString("en-us", {
      year: "numeric",
      month: format === "short" ? "short" : "long",
    });
  }

  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: format === "short" ? "short" : "long",
    day: "numeric",
  });
}

/**
 * Formats a date as ISO datetime string for HTML datetime attributes
 */
export function getDatetime(date: DateValue): string {
  if (typeof date === "string") {
    return `${date}-01`;
  }
  return date.toISOString();
}

/**
 * Converts a date value to a Date object for comparison
 */
export function toDate(date: DateValue): Date {
  if (typeof date === "string") {
    return new Date(date + "-01");
  }
  return date;
}
