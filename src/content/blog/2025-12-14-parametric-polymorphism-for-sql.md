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

| Solution                         | Generics/Templates     | Type Safety                  | Index Inheritance | Syntax Overhead | Maturity |
| -------------------------------- | ---------------------- | ---------------------------- | ----------------- | --------------- | -------- |
| **PostgreSQL Table Inheritance** | ❌ No                  | ⚠️ Partial (no FK on parent) | ❌ Manual         | Medium          | Mature   |
| **Oracle Object Types**          | ❌ No                  | ✅ Yes                       | ⚠️ Limited        | High            | Mature   |
| **Gel (EdgeDB)**                 | ⚠️ Abstract types only | ✅ Yes                       | ✅ Yes            | Medium          | Young    |
| **Prisma ORM**                   | ❌ No                  | ✅ Application-level         | N/A (ORM)         | Low             | Middle   |
| **Drizzle ORM**                  | ❌ No                  | ✅ Application-level         | N/A (ORM)         | Low             | Young    |
| **TypeORM**                      | ❌ No                  | ✅ Application-level         | N/A (ORM)         | Medium          | Mature   |
| **Hibernate (Java)**             | ✅ Yes (Java types)    | ⚠️ Partial (App-level only)  | ⚠️ Variable       | High            | Mature   |
| **Entity Framework (C#)**        | ✅ Yes (C# types)      | ⚠️ Partial (App-level only)  | ⚠️ Variable       | Medium          | Mature   |
| **Active Record (Ruby)**         | ❌ No                  | ❌ None (No FKs)             | ❌ Poor           | Low             | Mature   |
| **Eloquent (Laravel)**           | ❌ No                  | ❌ None (No FKs)             | ❌ Poor           | Low             | Mature   |
| **Django (Python)**              | ⚠️ Abstract Models     | ✅ Yes (Separate tables)     | ✅ Good           | Low             | Mature   |

### PostgreSQL Table Inheritance

Postgres offers table inheritance, but it's clunky and limited:

```sql
CREATE TABLE announcements_base (
  id          serial primary key,
  message     text not null,
  created_at  timestamptz not null default now()
);

CREATE TABLE course_announcements (
  course_id bigint not null references courses(id)
) INHERITS (announcements_base);
```

The problems are well-documented: indexes aren't inherited, foreign key
constraints don't work across the hierarchy, and this feature isn't used much in
favor of partitioning.

### Gel (formerly EdgeDB)

[Gel](https://www.geldata.com/) supports abstract types and inheritance, which
gets closer:

```edgeql
abstract type Announcement {
  required message: str;
  required link target -> Object;
  index on (.target);
}

type CourseAnnouncement extending Announcement {
  overloaded required link target -> Course;
}
```

This is better, but you must manually redefine the `target` link for every
specialized type using the `overloaded` keyword. It's still repetitive.

### ORMs: Application-Layer Solutions

I looked at how popular ORMs handle this problem. They all make development
easier, but none solve the database-level repetition.

**JavaScript/TypeScript** ORMs like Prisma, Drizzle, and TypeORM provide
excellent developer experience with strong type safety at the application layer.
But they still generate either separate tables (maintaining repetition) or
polymorphic associations (sacrificing foreign key constraints).

**Hibernate** offers three inheritance mapping strategies: single table with
discriminators, joined tables, or table-per-class. Powerful, but requires
extensive configuration and the type safety only exists in application code.

**Entity Framework** has similar strategies with cleaner syntax. Its
table-per-type approach creates proper foreign keys but requires joins for every
query and models inheritance hierarchies, not reusable templates.

**Django** provides abstract base models where you define common fields once and
inherit from them. This reduces repetition while maintaining separate tables,
but you still redefine foreign keys in each subclass.

**Active Record and Eloquent** make polymorphic associations trivial but don't
enforce foreign key constraints by default. They favor rapid development over
database-level integrity.

The pattern is clear: ORMs are great at application-level type safety but don't
eliminate schema repetition. You either repeat yourself across tables or
compromise on data integrity with polymorphic associations.

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
