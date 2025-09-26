import remarkToc from "remark-toc";

export default function remarkTocDynamic(options = {}) {
  return function(tree, file) {
    const { data } = file;
    const tocHeading = data?.astro?.frontmatter?.tocHeading;

    return remarkToc({
      heading: tocHeading || options.heading || "Table of Contents",
      ...options,
    })(tree, file);
  };
}
