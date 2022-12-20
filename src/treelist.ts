/**
 * Build tree data list
 * @param nodes
 * @param parentId
 */
export function makeTree(nodes: any[], parentId: any): any {
  return nodes
      .filter((node) => node.parentId === parentId)
      .reduce(
          (tree, node) => [
            ...tree,
            {
              ...node,
              children: makeTree(nodes, node.id),
            },
          ],
          []
      ); }