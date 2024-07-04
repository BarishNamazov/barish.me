export const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const bakuDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  date.setUTCHours(20);
  return date;
}