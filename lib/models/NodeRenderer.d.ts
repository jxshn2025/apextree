import { Node } from './GraphNode';
import { TreeOptions } from '../settings/Options';
import { EdgeObj as Edge, TreeGraph } from '../layout';
import { ChartContext, G } from '../../../../graph-utils/src/index.ts';

export interface NodeRendererCallbacks {
    getContainerElement: () => HTMLElement;
    onCollapse: (id: string) => void;
    onExpand: (id: string) => void;
    onFocusNode: (id: string) => void;
}
export declare class NodeRenderer {
    private readonly graph;
    private readonly nodeMap;
    private readonly renderOptions;
    private readonly chartContext;
    private readonly rootNodeId;
    private readonly callbacks;
    private readonly depthMap;
    constructor(graph: TreeGraph, nodeMap: Record<string, Node>, renderOptions: TreeOptions, chartContext: ChartContext, rootNodeId: string, callbacks: NodeRendererCallbacks, depthMap?: Map<string, number>);
    renderEdge(edge: Edge, group: G): void;
    renderGroupedLeafNodes(nodeId: string, mainGroup: G): void;
    renderLeafNode(nodeId: string, mainGroup: G, index: number): void;
    renderNode(nodeId: string, mainGroup: G): void;
}
