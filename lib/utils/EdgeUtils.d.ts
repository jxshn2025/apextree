import { Node } from '../models';

export declare const getEdge: (node: Node, newParent: Node, nodeWidth: number, nodeHeight: number, graphDirection: string) => null | string;
/**
 * Generates the side-bracket connector path for a grouped leaf node container
 * (_leafs pseudo-node) whose siblings are stacked vertically (top/bottom).
 *
 * A stem drops from the parent, turns at the midpoint toward the outer side of
 * the tree (away from the root), runs a vertical bar past all siblings, then
 * short horizontal ticks connect into each sibling.
 *
 * @param leafsNode      - the _leafs pseudo-node (dagre position + size)
 * @param parentNode     - the parent node
 * @param rootNode       - the root node (used to determine bracket side)
 * @param childCount     - number of leaf children
 * @param nodeWidth      - individual leaf node width
 * @param nodeHeight     - individual leaf node height
 * @param groupSpacing   - spacing between grouped leaf nodes
 * @param graphDirection - 'top' | 'bottom'
 */
export declare const getGroupedLeafBracketEdge: (leafsNode: Node, parentNode: Node, rootNode: Node, childCount: number, nodeWidth: number, nodeHeight: number, groupSpacing: number, childrenSpacing: number, siblingSpacing: number, graphDirection: string) => string;
