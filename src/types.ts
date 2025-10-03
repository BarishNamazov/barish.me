import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;
export type Lesson = CollectionEntry<"lessons">;
export type Post = BlogPost | Lesson;
