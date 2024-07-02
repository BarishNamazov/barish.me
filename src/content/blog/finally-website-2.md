---
title: Finally, *an updated* personal website!
description: I remade my personal website using Astro.
date: 2024-07-02
---

In October 2023, I [finally made a personal website](./finally-website)
using [Eleventy](https://www.11ty.dev/). It's a great static site generator,
but it didn't feel very natural to me — too much magic happening to put things
together. This was one reason I hesitated to make it open-source; I didn't feel
it was a good example. Additionally, I wanted a new design and took this
opportunity to start from scratch since my page content was minimal.

I also wanted a slightly better control of the build process and writing
custom JS/TS, so I was either going to go with [SvelteKit](https://svelte.dev/)
or [Astro](https://astro.build/). I thought it's time to give Astro a try since
I have heard a lot of good things about it, and it indeed is the most convenient
static site generator I've ever used. Although I'm not using it to its full
potential (where you can mix components from various frameworks),
the minimal version of it already makes a lot of development easy.

I can write TypeScript anywhere and create constants, functions,
or even components, and use them anywhere. I also enjoy component-based development
side of it, which simplifies the structure of my files. The built-in support for markdown
and [MDX](https://mdxjs.com/) is also super smooth.
I ran into zero issues developing and deploying my website.

It's either that Astro is really good, or I have become better at using static site
generators. I think it's a bit of both.

Those being said, here's the source code:
[https://github.com/BarishNamazov/barish.me](https://github.com/BarishNamazov/barish.me).
Feel free to use any code as it's MIT Licensed.
