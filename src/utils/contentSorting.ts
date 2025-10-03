import { toDate, type DateValue } from "./dateFormatting";

export function sortContentByDate<T extends { data: { date: DateValue } }>(
  content: T[],
): T[] {
  return content.sort((a, b) => {
    const aDate = toDate(a.data.date);
    const bDate = toDate(b.data.date);
    return bDate.valueOf() - aDate.valueOf();
  });
}
