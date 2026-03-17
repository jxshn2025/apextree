import { TreeGraph } from './TreeGraph';

/**
 * Lay out the tree stored in G using the Reingold-Tilford algorithm.
 *
 * Reads from each node label: `width`, `height`
 * Reads from graph attrs:     `rankdir`, `ranksep`, `nodesep`, `marginx`, `marginy`
 * Writes to each node label:  `x`, `y`
 * Writes to graph attrs:      `width`, `height`  (bounding box for fitScreen)
 */
export declare function treeLayout(G: TreeGraph): void;
