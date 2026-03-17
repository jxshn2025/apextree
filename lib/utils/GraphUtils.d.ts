import { TreeOptions, TreeDirection } from '../settings/Options';
import { NestedNode, Node } from '../models';
import { ChartContext, G } from '../../../../graph-utils/src/index.ts';

export interface ButtonPosition {
    x: number;
    y: number;
}
export declare const setAttributes: (element: Element | null, attrs?: Record<string, string | number>) => void;
export declare const ExpandCollapseButtonSize = 14;
/**
 * Calculate expand/collapse button position based on tree direction
 * All coordinates are relative to the node's local coordinate system (0,0 at top-left of node)
 */
export declare const getExpandCollapseButtonPosition: (direction: TreeDirection, nodeWidth: number, nodeHeight: number, buttonRadius: number) => ButtonPosition;
/**
 * Calculate the position of the collapse badge relative to the node's local coordinate system.
 * The badge is placed adjacent to the expand/collapse button, offset outward in the direction of
 * tree expansion.
 */
export declare const getCollapseBadgePosition: (direction: TreeDirection, buttonPosition: ButtonPosition, buttonRadius: number, badgeWidth: number, badgeHeight: number) => ButtonPosition;
export declare const applyButtonHoverEffects: (buttonGroup: G) => void;
export declare const highlightToPath: (selfNode: Node, nodeMap: Record<string, Node>, isHighlighted: boolean, options: TreeOptions, chartContext: ChartContext, containerClassName: string) => void;
export declare function processNodes(data: NestedNode): Record<string, Node>;
export declare function findParentsWithOnlyLeafNodes(tree: NestedNode): NestedNode[];
/**
 * Count the total number of hidden descendants for a collapsed node.
 * Traverses the nodeMap recursively through `hiddenChildren` arrays.
 */
export declare function countHiddenDescendants(nodeId: string, nodeMap: Record<string, Node>): number;
