/**
 * Shiki transformer for GitHub-style diff highlighting
 * Based on: https://usagi.io/articles/2024-04-24-adding-diff-highlighting-to-markdown-using-shiki/
 *
 * Usage: Add 'diff' to code block language, e.g., ```ts diff
 * Then prefix lines with + or - to indicate additions/removals
 */

export function transformerDiff(options = {}) {
  const {
    classLineAdd = 'add',
    classLineRemove = 'remove',
    classActivePre = 'diff'
  } = options;

  return {
    name: 'diff',
    preprocess(code, { meta }) {
      if (!meta?.__raw?.includes('diff')) {
        return code;
      }
      return code;
    },
    pre(node) {
      if (this.options.meta?.__raw?.includes('diff')) {
        this.addClassToHast(node, classActivePre);
      }
    },
    line(node, _line) {
      if (!this.options.meta?.__raw?.includes('diff')) {
        return;
      }

      // Check the first text node for diff markers
      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'span') {
          const textNode = child.children[0];
          if (textNode && textNode.type === 'text') {
            const text = textNode.value;

            if (text.startsWith('+')) {
              this.addClassToHast(node, classLineAdd);
              // Remove the + prefix from display
              textNode.value = text.slice(1);
              return;
            }

            if (text.startsWith('-')) {
              this.addClassToHast(node, classLineRemove);
              // Remove the - prefix from display
              textNode.value = text.slice(1);
              return;
            }
          }
        }
      }
    }
  };
}
