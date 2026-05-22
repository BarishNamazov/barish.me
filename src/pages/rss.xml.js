import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { stripDatePrefix } from "../utils/slugs";

export async function GET(context) {
  const posts = await getCollection("blog");
  const postsWithDates = posts.filter(post => post.data.publishedDate);
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: postsWithDates.map(post => ({
      ...post.data,
      pubDate: post.data.publishedDate,
      link: `/blog/${stripDatePrefix(post.slug)}/`,
    })),
  });
}
