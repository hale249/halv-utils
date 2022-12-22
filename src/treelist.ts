/**
 *  Build tree data
 * @param nodes
 * @param parentId
 * @param link
 */
export const makeTree = (nodes: Array<any>, parentId = null, link = 'parentId'): Array<any> => {
  return nodes
    .filter((item: any) => item[link] === parentId)
    .map((item: any) => ({
      ...item,
      children: makeTree(nodes, item.id),
    }));
};
