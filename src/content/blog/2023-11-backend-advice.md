---
title: "Beginner's FAQ for backend development"
date: 2023-11
description:
  "A simple guide to answer questions one might have when developing backends."
---

I've written plenty of backend code over the years and developed a few good
habits that are worth sharing. When you want to develop a simple app and deploy
it online, you'll inevitably need some kind of database and server setup. In
this post, I'll share some straightforward and deeper tips for writing elegant
backend code.

I am aiming this post at new learners, so some deeper concepts might be left out
intentionally, and some advice might seem too simple.

For context, I usually develop REST APIs, but these tips apply to other backend
architectures as well.

### Table of Contents

### A Word on Performance

> Premature optimization is the root of all evil. - Donald Knuth

Before diving into backend-specific tips, let's talk about performance. When I
first started building web apps, I was obsessed with speed. I'd spend hours
researching the fastest programming language, framework, and database, making
sure every line of code was optimized.

Here's the reality: most backend code handles CRUD operations (create, read,
update, delete). In these cases, your choice of programming language rarely
matters because the database is usually the bottleneck. It's far more valuable
to optimize your architecture, data modeling, and database queries than to worry
about whether your language is microseconds faster.

Don't get me wrong -- performance matters. But don't underestimate modern
hardware. Even with a "slow" language like Python, you can handle hundreds of
thousands of requests per second. You'll thank yourself later for choosing a
language with a strong ecosystem for your use case and focusing on clean,
maintainable code. Plus, web performance at scale typically comes from load
balancing across multiple servers, not from micro-optimizations.

That said, sometimes performance is critical. For example, I built "Orfoqrafiya
Bot," which corrects Azerbaijani spelling. I use Python with `rapidfuzz` (a C++
library) for initial word searches, but when that fails, I run a custom search
with Azerbaijani-specific rules. While `rapidfuzz` is lightning-fast, the custom
search can take hundreds of milliseconds, blocking other requests on a
single-core server. That's why I'm rewriting the app in Rust -- a language
that's both fast and has excellent web development tools.

### Choosing a Programming Language

> "There are only two kinds of languages: the ones people complain about and the
> ones nobody uses." - Bjarne Stroustrup

This might be the easiest decision you'll make. As we discussed, don't chase the
fastest language unless your specific use case demands it. Stick with popular
languages—they have mature ecosystems and strong community support. I personally
prefer Node.js, Python, or Rust for backend development.

### Choosing a Framework

> "Choosing a framework is like getting married. You have to live with it, and
> it might get messy if you make the wrong choice." - Unknown

> "Don't listen to the quote above. Instead, plan for easier divorce options." -
> Me

I'm serious about that second quote. I prefer unopinionated frameworks that give
you freedom rather than forcing specific patterns. We'll discuss how to avoid
framework lock-in later.

Currently, I'm building my own Node.js backend framework, inspired by FastAPI,
because I find Express.js code clunky and hard to read. It's part of my research
project—I'll share more about it soon.

I've used FastAPI (Python), Express.js (Node.js), and Actix (Rust), and they're
all solid choices.

### Separation of Concerns

> "A good architecture is like a good divorce: the parties are happier
> separated" - Also me

If backend code feels different from the "good software" you usually write,
something's wrong with your architecture. Early in my career, I felt like I was
just writing handlers and database queries with no clear place for business
logic or testing strategy.

The solution is layering your code. Here are two key boundaries I maintain:

1. **The web layer**: Your software should work without a web server. If you
   have an API endpoint that returns a list of users, you should be able to call
   that function directly from your code and get the same result.

2. **The database layer**: Your software should work without a database.
   Abstract your database so that if you replaced it with an in-memory
   structure, your core logic wouldn't change.

The web layer separation is essential—it makes your code testable and reusable.
The database layer separation isn't mandatory, but it makes your code flexible
and maintainable. Want to switch databases or use a different one for testing?
No problem.

My current research focuses on
[concept design](https://essenceofsoftware.com/tutorials/), a software modeling
approach that maximizes modularity and reusability. I'll write about it soon,
but you can build great software without following concept design rules. The key
idea is that different components in your app (like `User` and `Post`) should be
independent of each other.

**This is the most important tip in this entire post!**

### Choosing a Database and ORM

> "If you have a hammer, everything looks like a nail." - Abraham Maslow

A database is a tool for persistent storage—treat it as such. Don't let it
dictate your logic or architecture. I've used some unconventional "databases":

- Local JSON files
- JSON files stored on GitHub
- Git commit messages
- Google Sheets and Airtable

They worked perfectly for their purposes. I wasn't building large-scale
applications, but I got the job done efficiently. That's what matters. When you
separate your database layer properly, switching between different storage
solutions becomes trivial. I often use JSON files for testing and development,
then switch to a proper database for production.

For specific recommendations: PostgreSQL for SQL and MongoDB for NoSQL are both
solid choices with excellent language support.

Now, how should you interact with your database? I'm not a fan of ORMs
(Object-Relational Mappers) because they're often too opinionated and get in
your way. I prefer query builders that let me write raw queries when needed or
use methods to build queries programmatically. For PostgreSQL,
[Kysely](https://www.kysely.dev/) is excellent. For MongoDB, the official driver
works well.

SQL or NoSQL? For most toy projects, it doesn't matter. NoSQL works fine for my
use cases since I rarely need complex joins or migrations. MongoDB Atlas is
great for testing and development, and it's free for small projects. However, if
you're building a larger application that requires table joins, SQL is probably
your best bet.

### Data Modeling

> "All models are wrong, but some are useful." - George Box

> "All models are right, but some are useful." - Me

Data modeling advice is hard to generalize since it depends entirely on your use
case. Most of the time, you don't need to overthink it. But let me walk through
a specific example to illustrate the principles.

Imagine you're building a cash register app where users can add income and
expense items. Each item can have multiple tags like "food" or "transportation."
The app needs to:

- Calculate total income and expenses for date ranges
- Break down totals by tag
- Allow editing of items (rarely, and usually recent ones)
- Handle tens of thousands of items per month

Let's start with a simple model (MongoDB-style, but the concept applies
everywhere):

```ts
type Item = {
  id: string;
  type: "income" | "expense";
  amount: number; // always positive
  tags: string[];
  date: Date;
};

const cashRegisterDb = new Collection<Item[]>();
```

To calculate income and expenses for a date range:

```ts
const getIncomeAndExpense = (from: Date, to: Date) => {
  const items = cashRegisterDb.find({ date: { $gte: from, $lte: to } });
  const result = { income: 0, expense: 0 };
  for (const item of items) {
    result[item.type] += item.amount;
  }
  return result;
};
```

This works, but with 100k items in a date range, it could be slow when multiple
users run reports simultaneously. While this might be acceptable in practice
(people rarely generate reports over huge date ranges), we can optimize it.

One powerful technique is maintaining a
[running sum](https://usaco.guide/silver/prefix-sums) (prefix sum) of income and
expenses for each item. Then you can calculate totals for any date range by
subtracting the running sums of the first and last items in the range. This
makes queries much faster, but editing an item requires updating all subsequent
running sums. Since edits are rare and usually recent, this trade-off works
well.

What about tags? We could maintain running sums for each tag per item, but that
wastes space since most items won't have most tags. We could use sparse arrays,
but that complicates the code.

Here's a more elegant solution: separate the running sum calculation from the
data model and calculate per-day instead of per-item. There are only 365 days
per year, so regardless of how many items you have, you can store running sums
for income, expenses, and each tag per day.

Even simpler: instead of running sums, store daily totals for income, expenses,
and each tag. Queries iterate through days in the date range (fast enough for
most cases), and editing items only requires updating values for that specific
day.

The key lesson: data modeling matters, and you need to think carefully to avoid
problems later. Most data modeling challenges can be optimized infinitely, but
if something looks like it'll work, go with it.

### Do You Even Need to Code a Backend?

> "The best code is no code at all." - A lot of people, including me

Around my third backend project, I thought, "Why am I doing this? I'm just
writing CRUD operations." That's when I discovered tools that create backends
without code. They handle databases, authentication, access control, and APIs
automatically. Open-source examples include Pocketbase, Supabase, and AppWrite.
I've used Pocketbase (even before version 1.0), and it's fantastic—super easy to
use and deploy since it's just a single executable file.

How far can these tools take you? Quite far. Sometimes you'll need custom code
for complex logic or features they don't support, or you'll want more control
over critical parts of your app. The good news is you can combine these tools
with custom backend code.

For example, I built a survey website that needed to email me when someone
submitted responses. At the time, Pocketbase didn't support event-triggered
emails, so I wrote a simple backend for that while still using Pocketbase for
data storage:

```ts
import { Pocketbase } from "pocketbase";
import { sendEmail } from "./email";

const pb = new Pocketbase("my-pb-url");
const app = express();

app.post("/survey", async (req, res) => {
  const survey = req.body;
  await pb.insert("surveys", survey);
  await sendEmail("Someone filled out the survey");
  res.send("ok");
});
```

No database setup, no data storage complexity, and I could view all responses in
Pocketbase's dashboard.

### Conclusion

Most classic software engineering principles apply to backend development.
Clean, modular architecture, testable code, and thoughtful data modeling will
make your backend code significantly better.

I didn't cover microservices or serverless functions -- both popular backend
approaches worth discussing. These tips apply to them as well.

The bottom line: focus on solving your actual problem rather than
over-engineering solutions. Choose tools and patterns that let you build and
maintain your application effectively, and remember that you can always refactor
and optimize later when you have real performance data and user feedback.
