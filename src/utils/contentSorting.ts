export function sortContentByDate<T extends { data: { date: string | Date } }>(
  content: T[],
): T[] {
  return content.sort((a, b) => {
    const aDate =
      typeof a.data.date === "string"
        ? new Date(a.data.date + "-01")
        : a.data.date;
    const bDate =
      typeof b.data.date === "string"
        ? new Date(b.data.date + "-01")
        : b.data.date;
    return bDate.valueOf() - aDate.valueOf();
  });
}
