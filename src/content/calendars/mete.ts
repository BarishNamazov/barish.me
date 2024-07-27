import { createEvents } from "ics";

const range = (start: number, end: number, exclude: number[] = []) => {
  const excludeSet = new Set(exclude);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(val => !excludeSet.has(val));
};

const last = <T>(arr: T[]) => arr[arr.length - 1];

const pushTime = (time: number, days: number) => {
  const date = new Date(time);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

enum Month {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11,
}

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
    const date = bakuDate(2024, Month.July, 2 + 2 * i);
    return [
      `[CS50x] Week ${week}`,
      date.getTime(),
      `https://cs50.harvard.edu/x/2024/weeks/${week === 6.5 ? "ai" : week}/`,
    ];
  });
cs50x.push([
  "[CS50x] Finish up",
  bakuDate(2024, Month.July, 31).getTime(),
  "https://cs50.harvard.edu/x/2024/",
]);
// CS50x Finishes on July 31, 2024

// MIT 6.042 - Started on July 2, 2024
const mit_6042: SimpleEvent[] = [];
const examWeeks = [4, 8, 10, 12];
range(1, 12).forEach((week, i) => {
  const date = bakuDate(2024, Month.July, 2 + Math.floor(4.5 * i));
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
  const week = Math.floor(i / 2),
    part = i % 2;
  const date = bakuDate(2024, Month.July, 16 + 3 + Math.floor(i / 3) * 7);
  return [
    `[MIT 6.145] Assignment ${week}.${part}`,
    date.getTime(),
    `https://hz.mit.edu/catsoop/6.145/assignment${week}.${part}`,
  ];
});
mit_6145.push([
  '[MIT 6.145] Finish up',
  bakuDate(2024, Month.July, 31).getTime(),
  'https://hz.mit.edu/catsoop/6.145/',
]);
// 6.145 Finishes on July 31, 2024

// CS50p - Started on August 1, 2024
const cs50p: SimpleEvent[] = range(0, 9).map((week, i) => {
  const duration = week < 6 ? 3 : 5;
  const date = bakuDate(2024, Month.August, 1 + duration * i);
  return [
    `[CS50p] Week ${week}`,
    date.getTime(),
    `https://cs50.harvard.edu/python/2022/weeks/${week}/`,
  ];
});
// CS50p Finishes on TBD


// 6.101 - Started on August 1, 2024
const mit_6101: SimpleEvent[] = range(0, 13, [6, 7]).map((week, i) => {
  const duration = week < 6 ? 5 : 7;
  const date = bakuDate(2024, Month.August, 2 + duration * i);
  return [
    `[MIT 6.101] Week ${week} & Lab`,
    date.getTime(),
    `https://py.mit.edu/spring24`,
  ];
});
mit_6101.push([
  '[MIT 6.101] Super 6.101 Adventure',
  pushTime(last(mit_6101)[1], 7),
  'https://py.mit.edu/spring24',
]);
mit_6101.push([
  '[MIT 6.101] Super 6.101 Adventure 2 64 DS Ultra 3D (and Knuckles)',
  pushTime(last(mit_6101)[1], 7),
  'https://py.mit.edu/spring24',
]);
// 6.101 Finishes on TBD

const all: SimpleEvent[] = [...cs50x, ...mit_6042, ...mit_6145, ...cs50p, ...mit_6101];

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
