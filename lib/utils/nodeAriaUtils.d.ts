import { Node } from '../models/GraphNode';

/** Returns the 1-based depth of a node in the tree (root = 1). */
export declare function getNodeLevel(nodeId: string, nodeMap: Record<string, Node>): number;
/** Returns `{posinset, setsize}` for a node relative to its siblings. */
export declare function getNodeSiblingInfo(nodeId: string, nodeMap: Record<string, Node>, rootNodeId: string): {
    posinset: number;
    setsize: number;
};
/** Builds a human-readable aria-label for a node. */
export declare function buildAriaLabel(nodeId: string, nodeMap: Record<string, Node>, rootNodeId: string, contentKey: string): string;
