export const CONTENT_TYPES = [
  {
    key: "blog" as const,
    title: "Blog posts",
    description:
      "Personal thoughts and writings on various topics. Mostly related to computers.",
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
