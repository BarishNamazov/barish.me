import { toDate, type DateValue } from "./dateFormatting";

export function sortContentByDate<T extends { data: { publishedDate?: DateValue } }>(
  content: T[],
): T[] {
  return content.sort((a, b) => {
    if (!a.data.publishedDate && !b.data.publishedDate) return 0;
    if (!a.data.publishedDate) return 1;
    if (!b.data.publishedDate) return -1;
    const aDate = toDate(a.data.publishedDate);
    const bDate = toDate(b.data.publishedDate);
    return bDate.valueOf() - aDate.valueOf();
  });
}
