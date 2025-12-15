---
title: Parametric Polymorphism for SQL
description:
  A new approach to SQL schema design that treats database tables as generic,
  programmable templates.
publishedDate: 2025-12-14
---

SQL is the natural choice for highly relational data, which describes most web
applications with complex business logic. Yet every time I create a schema, I
find myself copying and pasting nearly identical table definitions, tweaking
only the foreign key references and a few field names. There has to be a better
way.

## The Problem: Repetitive Schema Patterns

Consider a learning management system with courses containing lessons and exams.
Users need announcements for courses ("The final exam is next week!"), lessons
("New material added!"), and exams ("The exam starts in 30 minutes."). The
pattern is identical -- each announcement targets a specific entity and includes
a message -- but we're forced to either:

1. **Create separate tables** for each type (`course_announcements`,
   `lesson_announcements`, `exam_announcements`), repeating all the common
   structure
2. **Use a polymorphic association** with `kind` and `kind_id` columns, losing
   foreign key integrity and mixing unrelated data in one table

Neither solution is ideal. The first violates DRY principles and creates
maintenance overhead. The second sacrifices type safety -- we can't enforce
foreign keys when `kind_id` might reference courses, lessons, or exams depending
on the `kind` discriminator. And storing all announcements in one table makes
indexing and querying less efficient.

What we really want is something like generics in programming languages:

```cpp
schema Announcements<Target> {
  id serial primary key;

  // {Target} gets replaced with the alias or snake_cased parameter name
  {Target}_id foreign key references Target(id);
  message text;
  created_at timestamptz;

  index(target_id);
}

// courses, lessons, and exams are tables we want to reference
table course_announcements = Announcements<courses[course]>;
table lesson_announcements = Announcements<lessons[lesson]>;
table exam_announcements = Announcements<exams[exam]>;
```

Each specialized table gets its own foreign key constraint, proper indexes, and
we define the pattern exactly once.

## What's Out There?

Application frameworks have spent decades trying to bridge the gap between
object-oriented inheritance and relational tables. I surveyed the existing
landscape to see what solutions exist for this problem. Here's what I found:

| Solution                   | Schema Generics           | Type Safety (FKs)            | Index Inheritance |
| :------------------------- | :------------------------ | :--------------------------- | :---------------- |
| **PostgreSQL Inheritance** | ❌ No                     | ⚠️ Partial (No FK on parent) | ❌ Manual         |
| **Oracle Object Types**    | ❌ No                     | ✅ Yes                       | ⚠️ Limited        |
| **Gel (EdgeDB)**           | ⚠️ Abstract types         | ✅ Yes                       | ✅ Yes            |
| **Prisma / Drizzle** (TS)  | ❌ No (manual repetition) | ✅ Yes                      | ❌ Manual         |
| **Hibernate** (Java)       | ✅ Yes (Java Types)       | ⚠️ Partial (App-level only)  | ⚠️ Variable       |
| **Entity Framework** (C#)  | ✅ Yes (C# Types)         | ⚠️ Partial (App-level only)  | ⚠️ Variable       |
| **Active Record** (Ruby)   | ❌ No                     | ❌ None (No FKs)             | ❌ Poor           |
| **Eloquent** (Laravel)     | ❌ No                     | ❌ None (No FKs)             | ❌ Poor           |
| **Django** (Python)        | ⚠️ Abstract models        | ✅ Yes (Separate tables)     | ✅ Yes            |

## The Ecosystem Gap

The table above highlights a structural, frustrating gap in the modern stack.
While application code has become modular and generic, database schemas remain
static and repetitive.

**The "Fake Generics" of Typed ORMs (Prisma, Drizzle)**

Tools like Prisma and Drizzle address the problem at the application layer, not
the database layer.

- **WET Schemas:** You might write a generic TypeScript function, but your
  schema definition file still contains `CourseAnnouncement`,
  `LessonAnnouncement`, and `ExamAnnouncement` defined line-by-line. Adding a
  column requires manually editing three different models. The code is DRY, but
  the schema is WET.
- **Incompatible Types:** Because the ORM generates distinct, structurally
  unique types for every model (e.g., `UserWhereInput` vs. `PostWhereInput`),
  writing truly generic functions is difficult. Developers often resort to
  complex structural typing or "any" casts, bypassing the strict type safety the
  tool is supposed to provide.

**The Integrity vs. Flexibility Trade-off (Rails, Laravel)**

Frameworks that prioritize schema reuse usually do so by sacrificing database
integrity.

- **Polymorphic Associations** allow reuse of a single table, but they rely on
  string discriminator columns (e.g., `kind="Course"`, `kind_id=123`). This
  approach is risky because **Foreign Keys cannot validate these pairs**. The
  database cannot ensure that `kind_id` corresponds to a valid row in the
  `courses` table, leading to "orphaned" records.

**The Complexity Trap (Hibernate, Entity Framework)**

Class-based inheritance mappers try to model OOP concepts in SQL, often
resulting in performance pitfalls.

- **Table-per-Type:** This strategy creates normalized tables (good) but
  requires massive `JOIN` operations to reconstruct a single entity (bad).
  Fetching a list of announcements often triggers complex queries across 4-5
  joined tables.
- **Single-Table Inheritance:** This dumps all fields into one sparse table. It
  avoids joins but fills the database with `NULL` values and prevents the use of
  `NOT NULL` constraints, weakening data quality.

**The "Almost" Solutions (PostgreSQL, Django, Oracle)**

Other approaches get closer but fall short on execution.

- **PostgreSQL Inheritance:** Native `INHERITS` is structurally flawed. Child
  tables do not inherit unique constraints or foreign keys from parents, making
  it unsafe for enforcing relationships.
- **Django Abstract Models:** Django allows you to define a base class that
  others inherit from. This is a step in the right direction (DRY definition),
  but it remains locked inside the Python runtime. The generated schema is still
  just a collection of disconnected tables with no knowledge of their shared
  structure.
- **Oracle Object Types:** Oracle supports true object-relational features, but
  they come with immense complexity and vendor lock-in, making them impractical
  for general-purpose web development.

There is currently no way to define a generic, reusable schema pattern _within_
SQL that compiles to performant, constraint-safe relational tables without
manual repetition.

## GSQL: Parametric Polymorphism for SQL

I decided to take on the challenge myself as part of a side project I was
building (which makes this a side project of my side project!).

I built GSQL to bring the power of generic programming to database schemas. The
key insight is treating schemas as first-class templates that can be
parameterized with types.

### Core Concepts

**Concepts** are generic schema patterns. Think of them as functions that take
type parameters and return concrete table definitions:

```
concept Announcing<Target, Author> {
    schema Announcements mixin Timestamps {
        id serial pkey;
        {Target}_id integer nonull ref(Target.id) ondelete(cascade);
        {Author}_id integer nonull ref(Author.id) ondelete(restrict);

        title varchar(255);
        content text nonull;

        index({Target}_id);
    }
}
```

The curly braces `{Target}` and `{Author}` are template variables that use
uppercase type parameter names. See instantiation below for how they get
replaced.

**Mixins** let you compose functionality. Here's a reusable timestamp pattern:

```
schema Timestamps {
    created_at timestamptz nonull default(NOW());
    updated_at timestamptz nonull default(NOW());

    trigger set_updated_at before update on each row execute function set_updated_at();
}
```

Any schema can `mixin Timestamps` to automatically get those fields and the
trigger -- no repetition needed.

**Instantiation** creates concrete tables from concepts:

```
// Define the base entities
users = Authing;  // Creates users table

// Create specialized announcements
exam_announcements = Announcing<exams[exam], users[author]>;
```

The syntax `exams[exam]` is aliasing -- it says "use the exams table and call it
'exam' in field names." The alias is used as-is (preserving case), so
`{Target}_id` becomes `exam_id`. Without an alias like `users`, the parameter
name is snake_cased, so `{Author}_id` becomes `author_id`. This lets you have
both `exam_id` and `author_id` that reference different tables with proper
foreign keys.

### A Complete Example

Let's look at a concept that manages conversations. A discussion system needs a
Thread (the container) and Comments (the actual replies).

```
concept Discussing<Target, Author> {
    enum thread_status {
        active;
        locked;
        archived;
        pinned;
    }

    // Schema 1: The container (e.g., an Exam)
    schema Threads mixin Timestamps {
        id serial pkey;

        // Links to what we are discussing (e.g., a Course or an Exam)
        {Target}_id integer nonull ref(Target.id) ondelete(cascade);
        {Author}_id integer nonull ref(Author.id);

        title varchar(255) nonull;
        is_locked boolean nonull default(false);
        view_count integer default(0);
        status thread_status nonull default(active);

        index({Target}_id);
        index(status);
    }

    // Schema 2: The content (e.g., The replies)
    schema Comments mixin Timestamps {
        id serial pkey;

        // SIBLING REFERENCE:
        // We reference the 'Threads' schema defined just above.
        // When instantiated, this becomes the actual table name (e.g., exam_discussion_id).
        {Threads}_id integer nonull ref(Threads.id) ondelete(cascade);

        {Author}_id integer nonull ref(Author.id);

        body text nonull;

        index({Threads}_id);
        index({Author}_id);
    }
}
```

Notice how:

- **Enums** are scoped to the concept and get namespaced when instantiated
- **Multiple schemas** can be defined in one concept -- both `Threads` and
  `Comments` get created together
- **Sibling-references** like `{Threads}_id` work because the schema name itself
  becomes the table name
- **Constraints and indexes** are automatically applied with the correct column
  names

Now we can create our real tables:

```
users = Authing;
courses = CourseManagement;
exams = ExamManagement;

course_announcements = Announcing<courses[course], users[author]>;
exam_announcements   = Announcing<exams[exam], users[author]>;

// Create "Course Forums"
// {Thread}_id above becomes course_thread_id
course_threads[course_thread], course_comments = Discussing<courses[course], users[user]>;

// Create "Exam Appeals"
// {Thread}_id above becomes exam_appeal_thread_id
exam_appeal_threads[exam_appeal_thread], exam_appeal_comments =
    Discussing<exams[exam], users[user]>;
```

For special use cases when you need to add extra indexes or constraints, you can
always extend the generated tables:

```
index(exam_announcements, created_at);
index(course_threads, view_count);
```

### Syntax Highlights

**Concise type syntax:**

```
id serial pkey;              // instead of: id serial primary key
email citext nonull;         // instead of: email citext not null
{User}_id integer ref(...);  // foreign keys with custom names
```

**Natural defaults and constraints:**

```
created_at timestamptz nonull default(NOW());
points integer check(points >= 0);
email varchar(255) unique;
```

**Index definitions inline:**

```
index(email) unique;
index(created_at);
index(exam_id, participant_id) unique;
index(tags) gin;  // GIN index for jsonb
```

**Foreign keys with cascading:**

```
{Exam}_id integer nonull ref(Exam.id) ondelete(cascade);
{Author}_id integer nonull ref(Author.id) ondelete(restrict);
```

**Functions and triggers:**

```
func set_updated_at() -> trigger {
    NEW.updated_at = NOW();
    return NEW;
}

trigger set_updated_at before update on each row execute function set_updated_at();
```

## Schema Migrations with Atlas

Once you have your GSQL schema, you need to actually apply it to a database.
GSQL compiles to plain SQL, which means you can use any migration tool. I've
found [Atlas](https://atlasgo.io) to be a great use case for this.

Atlas is a schema-as-code tool that automatically generates migration scripts by
comparing your desired state (the SQL output from GSQL) with your current
database state. The workflow is beautifully simple:

```bash
# Compile GSQL to SQL
gsql compile schema.gsql > schema.sql

# Let Atlas generate the migration
atlas migrate diff create_initial \
  --to file://schema.sql \
  --dev-url "docker://postgres/15/dev"

# Apply it
atlas migrate apply --url "postgresql://..."
```

The combination is powerful: GSQL eliminates schema boilerplate at authoring
time, and Atlas eliminates migration boilerplate at deployment time. Together,
they let you focus on modeling your domain instead of fighting your tools.

## Why GSQL Matters

After working with GSQL on a real project, I've come to appreciate what it
enables:

**1. True DRY schemas.** Define common patterns once, instantiate them anywhere.
No more copy-paste-modify cycles.

**2. Type-safe polymorphism.** Get the flexibility of polymorphic associations
with the safety of foreign key constraints. Each specialized table gets its own
FK.

**3. Composable abstractions.** Mix and match concepts to build complex schemas
from simple, reusable building blocks.

**4. Database-native.** Unlike ORMs, GSQL compiles to PostgreSQL. You get full
access to database features (constraints, indexes, triggers) while eliminating
repetition.

**5. Maintainability.** When you need to change a pattern (say, adding a field
to all announcements), you change it once in the concept. Update all
instantiations by recompiling.

## Try It Yourself

GSQL is highly experimental but functional. I use it in production for an
unlisted side project. The compiler is
[open source and available on GitHub](https://github.com/BarishNamazov/gsql).

You can also try the [online playground](https://gsql.barish.me/) to see some
more complicated examples and experiment with your own concepts.

The core idea -- parametric polymorphism for schemas -- feels inevitable. We've
had generics in programming languages for decades. SQL schemas deserve the same
power.

If you're tired of maintaining repetitive schema definitions, give GSQL a try.
And if you do, I'd love to hear what concepts you build and what you think of
it.

---

_GSQL is an experimental DSL. Use it in production at your own risk, but please
report bugs and share your concepts._
