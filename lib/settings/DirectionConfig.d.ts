import { GraphPoint } from '../models/GraphPoint';
import { Node } from '../models/GraphNode';

/**
 * Draws a side-bracket connector for vertically-stacked grouped sibling leaf
 * nodes (top/bottom directions).
 *
 * @param parentX      - parent center X
 * @param parentEdgeY  - Y of parent connecting edge (bottom for 'top', top for 'bottom')
 * @param siblingCenterYs - Y of the connecting edge of each sibling, in order
 * @param siblingCenterX - X center of the sibling column (same for all, equals parent X)
 * @param siblingNodeWidth - individual sibling node width
 * @param rootX        - X center of the root node (used to determine bracket side)
 * @param direction    - 'top' | 'bottom'
 */
export declare const siblingBracketVertical: (parentX: number, parentEdgeY: number, siblingCenterYs: number[], siblingCenterX: number, siblingNodeWidth: number, childrenSpacing: number, siblingSpacing: number, rootX: number, direction: 'top' | 'bottom') => string;
export declare const curvedEdgesHorizontal: (s: GraphPoint, t: GraphPoint, m: GraphPoint) => string;
export declare const curvedEdgesVertical: (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets?: {
    sy: number;
}) => string;
export interface DirectionConfigProperties {
    readonly calculateEdge: (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets: {
        sy: number;
    }) => string;
    readonly edgeMidX: (params: ConfigParams) => number;
    readonly edgeMidY: (params: ConfigParams) => number;
    readonly edgeParentX: (params: ConfigParams) => number;
    readonly edgeParentY: (params: ConfigParams) => number;
    readonly edgeX: (params: ConfigParams) => number;
    readonly edgeY: (params: ConfigParams) => number;
    readonly leafGroupX: (params: ConfigParams) => number;
    readonly leafGroupY: (params: ConfigParams) => number;
    readonly leafHeight: (params: ConfigParams) => number;
    readonly leafWidth: (params: ConfigParams) => number;
    readonly leafX: (params: ConfigParams) => number;
    readonly leafY: (params: ConfigParams) => number;
}
export interface ConfigParams {
    readonly childLength: number;
    readonly childrenSpacing: number;
    readonly height: number;
    readonly index: number;
    readonly node: Node;
    readonly nodeHeight: number;
    readonly nodeWidth: number;
    readonly parent: Node;
    readonly siblingSpacing: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
}
export declare const DirectionConfig: Record<string, DirectionConfigProperties>;
