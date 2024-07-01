---
title: "Beginner's FAQ for backend development"
date: 2023-11-20
description: "A simple guide to answer questions one might have when developing backends."
star: true
---

I don't consider myself as a web or backend developer,
but I have had to write some backend code for many reasons before.
If you want to develop a simple app and put it out online,
you will need some kind of database and server setup.
In this blog, I share some easy and some deeper tips on writing an elegant backend code.

For context, I usually develop my backend as a REST API, but the tips here are applicable to other types of backend models as well.

### Table of Contents

### A word on the performance

> Premature optimization is the root of all evil. - Donald Knuth

Before we talk about backend-specific tips, I want to mention something about performance.
When I started developing web apps, I was obsessed with performance.
I would focus on choosing the fastest programming language, the fastest framework,
the fastest database, and I would make sure my code is optimized.
I would spend hours or days researching and experimenting with different options.

Then most of my backend code would be dealing with CRUD operations (create, read, update, delete).
It would not matter at all how fast my code or framework was, because the bottleneck was the database in most cases.
It is far more important to optimize your architecture, data modeling, and database queries than to worry about the programming language.
More on that later.

I'm not saying that you should not care about performance.
But you should also not underestimate the power of modern hardware.
Even with a slow language like Python, you can handle hundreds of thousands of requests per second.
You will thank yourself later if you choose a language that has a better ecosystem for your use case and write cleaner code.
In addition, much of the performance in the web comes, only when needed, comes from load balancing (possibly over multiple servers).

Sometimes, indeed, you need to write performant code.
For example, I developed "Orfoqrafiya Bot," that takes in a word and returns the correct spelling of that word in Azerbaijani.
Right now, I use Python with a package called `rapidfuzz` (implemented in C++) to do the initial search in the word list,
but if that doesn't return a result, I do a custom search that incorporates some Azerbaijani-specific rules.
`rapidfuzz` is amazingly fast and handles most of the cases,
but the custom search sometimes takes a few hundred milliseconds, which makes all the other requests wait for it on a single-core server.
Thus, I'm planning to rewrite the app and the custom search in Rust, which is a fast language and has a good ecosystem for web development (fortunately, rapidfuzz has a port for it!).

### Programming language choice

> "There are only two kinds of languages: the ones people complain about and the ones nobody uses." - Bjarne Stroustrup

Honestly, this might be the easiest decision to make out of all things.
As discussed above, don't rush for the fastest language, unless your use case requires it.
It's generally a safe choice to go with most of the popular languages, as they have a good ecosystem and community support.
I personally prefer one of Node.js, Python, or Rust for backend development.

### Framework choice

> "Choosing a framework is like getting married. You have to live with it, and it might get messy if you make the wrong choice." - Unknown

> "Don't listen to the quote above. Instead plan on an easier divorce options." - Me

I'm quite serious about my quote.
I would personally try to go with an unopinionated framework, which gives you more freedom.
Instead, I will discuss further below how to not depend on a framework too much.

That being said, I am currently developing my own backend framework in Node.js, a bit inspired by FastAPI,
since I am pretty annoyed by the way Express.js code looks and feels like. It's part of my research project,
and I will share more about it in the future.

I have used FastAPI (Python), Express.js (Node.js), and Actix (Rust) before and they are all pretty usable.

### Separation of concerns

> "A good architecture is like a good divorce: the parties are happier separated" - Also me

If you have ever noticed that backend code feels different than the "good software" you usually write,
then something about the architecture is probably wrong. For me, it felt like I was just writing a bunch of handlers and database queries.
I was not sure where to put my business logic, and I was not sure how to test it.

The solution is to separate your code into different layers.
It is hard to draw the line between the layers, but here is two lines that I draw:

1. The web layer: your software should be able to work, as is, without a web server. For example, if you have an API endpoint that returns a list of users, you should be able to call a function directly from your code and get the list of users.

2. The database layer: your software should be able to work, as is, without a database. Your database should be abstracted, and if you were to replace it with an in-memory structure, the code ideally should not change.

The web layer is a must to separate. It will make your code testable and reusable. The database layer is not a must, but it will make your code more flexible and easier to maintain. If you want to either change your database or use a different database for testing, you will not have to change your code.

My current research focuses on [*concept design*](https://essenceofsoftware.com/tutorials/), which is a way of modeling software to maximum modularity and reusability.
I am planning to write a blog post about it in the future, but your software still can be great without following concept design rules.
The basic idea is, however, that the different components in your app, like `User` and `Post`, should be independent of each other.

This is by far the most important tip in this blog post!

### Database/ORM choice

> "If you have a hammer, everything looks like a nail." - Abraham Maslow

Database is a tool for persistent storage, and it should be treated as such.
It shouldn't get in the way of your logic or architecture.
I have used the most untraditional things as my database before:
- A local JSON file
- A JSON file on Github
- Commit messages of Git
- Google Sheets / Airtable

And they worked great. Of course, I wasn't building a large-scale app, but I was able to get the job done.
That's what you should be focusing on.
In fact, if you separate your database layer, you can easily switch between different databases.
I usually do that and use a local JSON file for testing and development, and a real database for production.

If you are looking for specific recommendations, then I'd suggest checking out PostgreSQL as a SQL and MongoDB as a NoSQL database.
Both are pretty solid and have good support for most programming languages.

Now, the question of interacting with the database is a bit more complicated.
Personally, I dislike ORMs (Object-Relational Mappers) because they are usually too opinionated and get in the way of your code.
Instead, I prefer query builders, which allow me to either write the query directly or use methods to build the query.
For PostgreSQL, [Kysely](https://www.kysely.dev/) is pretty nice, and for MongoDB the official driver is good enough.

Should you use SQL or NoSQL? Chances are, it doesn't matter for you.
For most of my use cases, NoSQL works just fine since I don't need to deal with migrations or other SQL stuff.
In addition, MongoDB Atlas works nicely for testing and development, and it's free for small projects.
However, if you are building a larger app and need to `JOIN` tables, then SQL is probably the way to go.

### Data modeling

> "All models are wrong, but some are useful." - George Box

> "All models are right, but some are useful." - Me

It's hard to give specific advice on data modeling, since it depends on your use case.
Again, chances are, you don't need to worry about it too much.
However, let me give you a specific example so it's food for thought.

Let's say you are building a cash register app, and you can add items into the register (either income or expense).
Each item can also have (possibly multiple) tags, like "food" or "transportation."
The app should support finding total income and expense for given date ranges by the user, both overall and for each tag.
It also should be possible to edit a cost of an already added item, but this action will be very rare (and mostly only about a recent item).
Let's say there'll be around 10s of thousands of items added to the register per month.

First, let's just try to calculate the overall income and expense for a given date range, ignoring the tags.
How would you model this data? One simple way (in MongoDB-style, but can generalize):

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

Now, with this data model, you could do a search to find your answer (pseudo-code):

```ts
const getIncomeAndExpense = (from: Date, to: Date) => {
  const items = cashRegisterDb.find({ date: { $gte: from, $lte: to } }); // find items in the given date range
  const result = { income: 0, expense: 0 };
  for (const item of items) {
    result[item.type] += item.amount;
  }
  return result;
};
```

If there were 100k items in the given date range, this could take a bit of time.
Not that much, but it would be noticable if, around 10 people were using the app at the same time.
Honestly though, in practice, this might be already good enough since people won't be wondering reports over a long time range.
Thus, we ideally want to make this faster.

One simple but powerful trick would be to maintain a [running sum](https://usaco.guide/silver/prefix-sums) (aka, prefix sum) of income and expense for each item.
Then, you could find the total income and expense for a given date range by subtracting the running sums of the last and first items in the range.
This would now make queries much faster, but when you edit an item, you would have to update the running sums of all the items after it.
We said that editing items would be rare or would be on a recent item, so this is not a big deal.

Now, let's add the tags to the mix.
We want to find the total income and expense for each tag in a given date range.
Will the same trick work? Yes, but we will have to maintain a running sum for each tag for each item.
That sounds like a lot of wasted space since most items won't have most tags.
We could use a sparse array, but that would make the code more complicated.

There are many ways to solve this problem, but I think the best, and the most elegant way, is to separate the calculation of the running sum from the data model and do it per-day instead of per-item. There are only 365 dates in a year, so per-year, no matter, how many items are there, we can store the running sums for income, expense, and for each tag per day (compared to 10K per month!).

In fact, we could simplify things and instead of storying running sums, we could just store the total income and expense for each day and for each tag. Yes, this would require every query to iterate through every day in the given date range, but it would be fast enough for most use cases. In addition, it would make editing items much easier, since we would only have to update the values for the given day.

The whole point of this big section is to show you that the data model will matter, and you need to be careful about it so you don't get yourself in trouble later.
Almost all data modeling problems can be optimized to the use case infinitely, but if something seems like it's going to work, I would suggest going with it.

### Do you even need to code a backend?

> "The best code is no code at all." - A lot of people, including me

When I coded my like, third backend, I was like, "Why am I doing this? I'm just writing a bunch of CRUD operations."
Then I started to look around and found these tools that allow you to create a backend without writing a single line of code.
They handle the database, the authentication, access rules, and the API for you.
Open-source examples include Pocketbase, Supabase, AppWrite.
I have used Pocketbase even thought it hasn't hit 1.0 yet, and it's great. Super easy to use and deploy since it's just a single file.

How far can you go with these tools? Quite far, actually.
But sometimes you will need to write some custom code because it's either too complicated to do so in the tool or it's not supported.
Or perhaps it's a critical part of your app and you want to have more control over it.
Good news is, you can still use these tools and write your own backend code.

For example, I made a website that did a survey and then emailed some message to my email saying that someone filled out the survey.
At the time, Pocketbase didn't support emailing on a specific event, so I wrote a simple backend that did that, but still used Pocketbase for the database.

The code looked something like (pseudo-code):

```ts
import { Pocketbase } from "pocketbase";
import { sendEmail } from "./email";
const pb = new Pocketbase("my-pb-url");
const app = express();

app.post("/survey", async (req, res) => {
  const survey = req.body;
  await pb.insert("surveys", survey);
  await sendEmail("someone filled out the survey");
  res.send("ok");
});
```

No need to set up a database or deal with how data is stored, and I can nicely view the data in the Pocketbase dashboard.

### Conclusion

If you noticed, most of the classic "software engineering" tips apply to backend development as well.
Making sure that your architecture is clean and modular, your code is testable, and your data model is well thought out will make your backend code much better.

Note that I didn't discuss about microservices or serverless functions, which are also popular ways of developing backend code.
They are worth discussion, but the tips above apply to them as well.
I am planning to talk about microservices in my post about concept design, so stay tuned for that.