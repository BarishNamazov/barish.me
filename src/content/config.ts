import { defineCollection, z } from "astro:content";

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  star: z.boolean().optional(),
});

const blog = defineCollection({
  type: "content",
  schema: blogSchema,
});

export const collections = { blog };
