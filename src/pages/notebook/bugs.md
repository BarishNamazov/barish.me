---
layout: ../../layouts/BlogLayout.astro
title: Noteworthy Bugs
description:
  Is this a normal bug, or one of those horrifying ones that prove your whole
  project is broken beyond repair and should be burned to the ground?
---

![Obligatory xkcd](https://imgs.xkcd.com/comics/new_bug.png)

## 2025-12-13: don't use expensive hash in your tests

I was using `Bun.password.hash` for hashing passwords in an app I'm working on.
The default behavior uses `argon2`, which is great for security, but
unfortunately very slow.

It never appeared to me that was the cause of my tests taking forever to run,
because in each I have to login. I knew something was very wrong, but the
profiling output made it very clear :-)

## 2025-10-27: don't use mtime with deployed files

I used `mtime` to get the last updated date of some entries in my blog and it
worked fine locally. I missed the point that when I deploy this website, the
repository is cloned and `mtime` isn't preserved. A better way to fix this is to
use git: `git log -1 --format=%ai -- <file>`, but keep in mind that it won't
work before the file is committed.
