type MdxNode = { type: string; name?: string | null; children?: MdxNode[] };

/**
 * Remark plugin: drops every JSX element (raw HTML included) we have no component for, so a content edit
 * cannot add <script>, <iframe srcdoc> or <meta refresh>. next-mdx-remote already strips {…} and import/export.
 */
export const allowOnly = (names: readonly string[]) => () => (tree: MdxNode) => {
  const walk = (node: MdxNode) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !child.type.startsWith("mdxJsx") || names.includes(child.name ?? ""));
    node.children.forEach(walk);
  };
  walk(tree);
};
