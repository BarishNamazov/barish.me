export const CONTENT_TYPES = [
  {
    key: "blog" as const,
    title: "Blog posts",
    description:
      "I occasionally write! A starred blog post means it was appreciated more by my friends.",
    titlePrefix: "Blog posts",
  },
  {
    key: "lessons" as const,
    title: "Lessons",
    description: "Some notes from my teachings.",
    titlePrefix: "Lessons",
  },
] as const;

export type ContentTypeKey = (typeof CONTENT_TYPES)[number]["key"];

export function getContentTypeConfig(key: ContentTypeKey) {
  return CONTENT_TYPES.find(type => type.key === key)!;
}
