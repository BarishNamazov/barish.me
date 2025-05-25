import { defineCollection, z } from "astro:content";

export const BlogSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    star: z.boolean().optional(),
});

const blog = defineCollection({
    type: "content",
    schema: BlogSchema,
});

const lessons = defineCollection({
    type: "content",
    schema: BlogSchema,
});

export const collections = { blog, lessons };
