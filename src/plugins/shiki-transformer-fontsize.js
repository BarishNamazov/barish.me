/**
 * Shiki transformer for custom font sizes in code blocks
 *
 * Usage:
 * - Custom size: ```js fontSize=0.9em
 * - Named sizes: ```js small or ```js large
 *
 * Named sizes:
 * - tiny: 0.7em
 * - small: 0.75em
 * - medium: 0.85em (default)
 * - large: 1em
 * - xl: 1.15em
 */

export function transformerFontSize(options = {}) {
  const namedSizes = {
    tiny: "0.7em",
    small: "0.75em",
    medium: "0.85em",
    large: "1em",
    xl: "1.15em",
    ...options.namedSizes,
  };

  return {
    name: "font-size",
    pre(node) {
      const meta = this.options.meta?.__raw;
      if (!meta) return;

      let fontSize = null;

      // Check for fontSize=<value> pattern
      const fontSizeMatch = meta.match(/fontSize=([\d.]+(?:em|rem|px|%))/);
      if (fontSizeMatch) {
        fontSize = fontSizeMatch[1];
      }

      // Check for named sizes
      if (!fontSize) {
        for (const [name, size] of Object.entries(namedSizes)) {
          if (meta.includes(name)) {
            fontSize = size;
            break;
          }
        }
      }

      // Apply font size if found
      if (fontSize) {
        if (!node.properties) {
          node.properties = {};
        }
        if (!node.properties.style) {
          node.properties.style = "";
        }
        node.properties.style += `font-size: ${fontSize};`;
      }
    },
  };
}
