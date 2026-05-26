const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getLocalDate = (date: Date, timezone: string): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Unable to format local date for timezone: ${timezone}`);
  }

  return `${year}-${month}-${day}`;
};

export const isValidLocalDate = (localDate: string): boolean => {
  if (!LOCAL_DATE_PATTERN.test(localDate)) {
    return false;
  }

  const [yearText, monthText, dayText] = localDate.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
};
