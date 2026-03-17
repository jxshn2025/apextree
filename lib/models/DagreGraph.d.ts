import { Paper } from './Paper';
import { NestedNode } from './GraphNode';
import { TreeDirection, TreeOptions } from '../settings/Options';
import { ChartContext } from '../../../../graph-utils/src/index.ts';

export declare class Graph extends Paper {
    options: TreeOptions;
    private data;
    private graph;
    private nodeMap;
    private preservedPositions;
    /** Options resolved with CSS custom property overrides for the current render pass. */
    private renderOptions;
    /** Keyboard navigator instance (created lazily when a11y is enabled). */
    private keyboardNavigator;
    /** Tracks which node IDs were visible before the last render (for diff animation). */
    private prevNodeIds;
    /** The node ID that triggered a collapse/expand, used to scope expand animations. */
    private changedNodeId;
    constructor(element: HTMLElement, options: TreeOptions, chartContext: ChartContext);
    private calculateLayout;
    private resetGraph;
    private setGraphNodesAndEdges;
    private setNodesRecursively;
    /**
     * Build a depth map for all current graph nodes (root = 0).
     * Used to drive rank-wave stagger delays during entrance animations.
     */
    private buildDepthMap;
    /**
     * After the SVG is added to the DOM, query all node `<g>` elements and
     * run entrance animations for nodes that are new (not in prevNodeIds).
     *
     * For expand mode we only animate new nodes (descendants of changedNodeId).
     * For initial render all nodes animate.
     * For data-update only genuinely new node IDs animate.
     * For collapse and layout-change no entrance animation runs.
     */
    private runNodeEntranceAnimations;
    /**
     * After node animations settle, run draw-on animations for all edge paths
     * that connect to newly-visible nodes.
     */
    private runEdgeAnimations;
    changeLayout(direction?: TreeDirection): void;
    collapse(nodeId: string): void;
    construct(data: NestedNode): void;
    expand(nodeId: string): void;
    fitScreen(): void;
    render({ keepOldPosition, mode, }?: {
        keepOldPosition?: boolean;
        mode?: 'initial' | 'expand' | 'collapse' | 'data-update';
    }): void;
}
