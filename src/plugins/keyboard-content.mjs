// Keep overflowing examples and reference tables reachable without a pointer.
function visit(node) {
  if (node.type === 'element' && ['pre', 'table'].includes(node.tagName)) {
    node.properties ??= {};
    node.properties.tabIndex = 0;
  }
  for (const child of node.children ?? []) visit(child);
}

export function focusableTables() {
  return visit;
}

export const focusableCode = {
  name: 'Dygo keyboard-accessible code',
  hooks: {
    postprocessRenderedBlockGroup: ({ renderData }) => visit(renderData.groupAst),
  },
};
