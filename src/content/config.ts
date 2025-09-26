import { defineCollection, z } from "astro:content";

export const BlogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.union([
    z.date(),
    z
      .string()
      .regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format or a valid date"),
  ]),
  updatedDate: z
    .union([
      z.date(),
      z
        .string()
        .regex(
          /^\d{4}-\d{2}$/,
          "Date must be in YYYY-MM format or a valid date",
        ),
    ])
    .optional(),
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
