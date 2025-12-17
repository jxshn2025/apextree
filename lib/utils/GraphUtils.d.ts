import { TreeOptions, TreeDirection } from '../settings/Options';
import { ChartContext } from '../../../../graph-utils/src/index.ts';

export interface ButtonPosition {
    x: number;
    y: number;
}
export declare const setAttributes: (element: Element | null, attrs?: Record<string, any>) => void;
export declare const ExpandCollapseButtonSize = 14;
/**
 * Calculate expand/collapse button position based on tree direction
 * All coordinates are relative to the node's local coordinate system (0,0 at top-left of node)
 */
export declare const getExpandCollapseButtonPosition: (direction: TreeDirection, nodeWidth: number, nodeHeight: number, buttonRadius: number) => ButtonPosition;
export declare const applyButtonHoverEffects: (buttonGroup: any) => void;
export declare const highlightToPath: (selfNode: any, nodeMap: Record<string, any>, isHighlighted: boolean, options: TreeOptions, chartContext: ChartContext) => void;
export declare function processNodes(data: any): Record<string, any>;
export declare function findParentsWithOnlyLeafNodes(tree: any): any[];
