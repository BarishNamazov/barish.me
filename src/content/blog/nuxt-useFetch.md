---
title: Custom useFetch wrapper for Nuxt
description: useFetch in Nuxt can be hard to customize since wrapping it manually loses type completion. Here's how to do it correctly.
date: 2024-03-27
---

I am working on an automated web scraping project, originally for my class project but keeping it open-source.
It's called [Scraps](https://github.com/BarishNamazov/scraps).

I decided to use Nuxt because I am doing server-side work. Nuxt's `useFetch` composable is pretty cool.
One great feature it has is that it's able to autocomplete your API calls from
Nitro (it's backend framework) and automatically infer the type of the response.
If you want to write a custom wrapper for it, however, you lose that feature, which is a bummer.

[This has come up before](https://github.com/nuxt/nuxt/issues/23154). One provided solution was to replicating the 
type of `useFetch` like:

```ts
- export function useCustomFetch<T> (url: 
+ export const useCustomFetch: typeof useFetch = function useCustomFetch<T> (url: 
```

However, now you can't customize the parameters given to `useFetch` like `options`.
In my case, I wanted to add `alert` and `suppress` properties to the options.
I spent a bit of time looking into how Nuxt types are defined and found a solution that works well.
I wish it was a bit cleaner and had less type gymnastics,
but I believe this is close to lowest amount of changes to make it work.

You probably want to take the type declarations out and put them in a separate
`.d.ts` file, but I will keep them in the same file here so you can easily copy.

Cheers!

<script src="https://gist.github.com/BarishNamazov/f9827165c4259d29b16a99c9d018588c.js"></script>