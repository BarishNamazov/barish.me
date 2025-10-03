import { getCollection } from "astro:content";
import type { ContentTypeKey } from "../content-types";

export function stripDatePrefix(slug: string): string {
  return slug.replace(/^\d{4}-\d{2}(-\d{2})?-/, '');
}

export async function createStaticPathsForContentType(
  contentType: ContentTypeKey,
) {
  const posts = await getCollection(contentType);
  return posts.map(post => ({
    params: { slug: stripDatePrefix(post.slug) },
    props: { post, contentType },
  }));
}
