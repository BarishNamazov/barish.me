import { defineCollection, z } from "astro:content";

const dateSchema = z.union([
  z.date(),
  z
    .string()
    .regex(
      /^\d{4}-\d{2}(-\d{2})?$/,
      "Date must be in YYYY-MM or YYYY-MM-DD format",
    ),
  z.coerce.date(),
]);

export const BlogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedDate: dateSchema.optional(),
  updatedDate: dateSchema.optional(),
  katex: z.boolean().optional().default(false),
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
