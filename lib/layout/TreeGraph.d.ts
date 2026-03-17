export interface EdgeObj {
    v: string;
    w: string;
}
/** Minimum shape stored in the node map and consumed by treeLayout. */
export interface NodeLabel {
    x: number;
    y: number;
    width: number;
    height: number;
    [key: string]: unknown;
}
export interface GraphAttrs {
    height?: number;
    marginx?: number;
    marginy?: number;
    nodesep?: number;
    rankdir?: string;
    ranksep?: number;
    width?: number;
}
/**
 * Minimal directed-graph data structure for the tree layout engine.
 *
 * Provides exactly the graphlib.Graph API surface used by DagreGraph.ts:
 *   setDefaultEdgeLabel, setGraph, graph, setNode, node, nodes, setEdge, edges
 *
 * Plus two helpers consumed by treeLayout:
 *   children(v) — outgoing neighbour ids
 *   root()      — the unique node with no incoming edge
 */
export declare class TreeGraph {
    private _nodes;
    private _outEdges;
    private _inEdges;
    private _graphAttrs;
    setDefaultEdgeLabel(_fn: () => unknown): void;
    setGraph(attrs: GraphAttrs): void;
    graph(): GraphAttrs;
    setNode(id: string, label: NodeLabel): void;
    node(id: string): NodeLabel | undefined;
    nodes(): string[];
    setEdge(v: string, w: string): void;
    edges(): EdgeObj[];
    /** Returns the ids of all nodes that are direct children of v (outgoing edges). */
    children(v: string): string[];
    /**
     * Returns the id of the root node — the unique node with no incoming edges.
     * Throws if the graph is empty or has no such node.
     */
    root(): string;
}
