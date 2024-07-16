import { createEvents } from "ics";

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const bakuDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  date.setUTCHours(19, 59, 59);
  return date;
};

type SimpleEvent = [string, number, string];

// Harvard CS50x - Started on July 2, 2024
// Each week is due every two days.
const cs50x: SimpleEvent[] = range(0, 10)
  .concat([6.5])
  .toSorted((a, b) => a - b)
  .map((week, i) => {
    const date = bakuDate(2024, 6, 2 + 2 * i);
    return [
      `[CS50x] Week ${week}`,
      date.getTime(),
      `https://cs50.harvard.edu/x/2024/weeks/${week === 6.5 ? "ai" : week}/`,
    ];
  });

// MIT 6.042 - Started on July 2, 2024
const mit_6042: SimpleEvent[] = [];
const examWeeks = [4, 8, 10, 12];
range(1, 12).forEach((week, i) => {
  const date = bakuDate(2024, 6, 2 + Math.floor(4.5 * i));
  mit_6042.push([
    `[MIT 6.042] Problemset ${week}`,
    date.getTime(),
    `https://openlearninglibrary.mit.edu/courses/course-v1:OCW+6.042J+2T2019/course/`,
  ]);
  if (examWeeks.includes(week)) {
    // Exam weeks
    date.setDate(date.getDate() + 1);
    mit_6042.push([
      `[MIT 6.042] Exam ${examWeeks.indexOf(week) + 1}`,
      date.getTime(),
      `https://openlearninglibrary.mit.edu/courses/course-v1:OCW+6.042J+2T2019/course/`,
    ]);
  }
});

// 6.145 - Started on July 16, 2024
const mit_6145: SimpleEvent[] = range(0, 5).map((_, i) => {
  const week = Math.floor(i / 2), part = i % 2;
  const date = bakuDate(2024, 6, 16 + 3 + Math.floor(i / 3) * 7);
  return [
    `[MIT 6.145] Assignment ${week}.${part}`,
    date.getTime(),
    `https://hz.mit.edu/catsoop/6.145/assignment${week}.${part}`,
  ];
});

const all: SimpleEvent[] = [...cs50x, ...mit_6042, ...mit_6145];

const ics = createEvents(
  all.map(([title, deadline, url]) => ({
    title,
    start: deadline,
    end: deadline,
    url,
    organizer: { name: "Barish Namazov", email: "hello@barish.me" },
    attendees: [{ name: "Mete Namazov", email: "mete.namazov22@gmail.com" }],
  }))
);

export default ics;
