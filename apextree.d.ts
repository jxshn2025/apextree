declare abstract class BaseChart {
  /** @internal */
  protected element: HTMLElement;
  /** Destroys the chart instance and cleans up DOM resources. */
  destroy(): void;
  /** Returns the unique identifier for this chart instance. */
  getInstanceId(): string;
}
/** @internal */
declare class ChartContext {
  constructor(element: HTMLElement, instanceId?: string);
  isShadowDOM(): boolean;
  getInstanceId(): string;
  destroy(): void;
}
/** @internal */
declare class Circle extends WrappedEl {}
/** @internal */
declare interface CircleAttr {}
/** @internal */
declare class ForeignObject extends WrappedEl {}
/** @internal */
declare class G extends WrappedEl {}
/** @internal */
declare class Path extends WrappedEl {}
/** @internal */
declare class Rect extends WrappedEl {}
/** @internal */
declare class SvgCanvas {}
/** @internal */
declare class Text_2 extends WrappedEl {}
/** @internal */
declare interface TextAttr { dx?: number; dy?: number; x?: number; y?: number; }
/** @internal */
declare class WrappedEl {}













/**
 * WCAG 2.1 AA accessibility options for the tree chart.
 *
 * Controls ARIA role/label semantics on the SVG root and enables keyboard
 * navigation. Disable only when rendering inside a container that already
 * provides its own accessibility layer.
 */
export declare interface A11yOptions {
    /** Enable ARIA semantics and keyboard navigation. Default: true */
    readonly enabled?: boolean;
    /** Override the default `aria-label` ("Organizational chart") on the root SVG. */
    readonly label?: string;
}

declare class ApexTree extends BaseChart {
    graph: Graph;
    options: TreeOptions;
    /**
     * Create a new ApexTree instance.
     *
     * Dimensions are applied to the host element immediately. Call `render()` to
     * build the SVG tree after construction.
     *
     * @param element - The `HTMLElement` that will contain the tree SVG.
     * @param options - Partial `TreeOptions` to override defaults. Any omitted
     *   field falls back to its default value (see `DefaultOptions`).
     *
     * @example
     * ```ts
     * import { ApexTree } from 'apextree';
     * const tree = new ApexTree(document.getElementById('chart')!, {
     *   direction: 'top',
     *   nodeWidth: 120,
     *   nodeHeight: 40,
     * });
     * ```
     */
    constructor(element: HTMLElement, options?: Partial<TreeOptions>);
    /**
     * Set the global ApexCharts license key.
     *
     * Call this once before creating any chart instance, typically at app startup.
     * Without a valid license the chart renders with a watermark.
     *
     * @param key - The license key string provided by ApexCharts.
     *
     * @example
     * ```ts
     * import { ApexTree } from 'apextree';
     * ApexTree.setLicense('YOUR_LICENSE_KEY');
     * ```
     */
    static setLicense(key: string): void;
    private setupElementDimensions;
    /**
     * Handle watermark display based on license validation
     */
    private handleWatermark;
    /**
     * Render the tree into the element supplied in the constructor.
     *
     * Constructs the internal graph layout and writes the SVG to the DOM.
     * If `options.enableToolbar` is `true`, the zoom/pan/export toolbar is also
     * rendered inside the container.
     *
     * @param data - The root `NestedNode` of the tree hierarchy. Each node must
     *   have a unique `id` and a `name` (used as the display label). Nest children
     *   recursively via the `children` array.
     * @returns The internal `Graph` instance, which exposes `zoom()`, `fitScreen()`,
     *   and `exportToSvg()` for programmatic control after render.
     *
     * @throws {Error} If the container element is not found.
     *
     * @example
     * ```ts
     * tree.render({
     *   id: 'ceo',
     *   name: 'Alice',
     *   children: [
     *     { id: 'vp1', name: 'Bob', children: [] },
     *     { id: 'vp2', name: 'Carol', children: [] },
     *   ],
     * });
     * ```
     */
    render(data: NestedNode): Graph;
}
export { ApexTree }
export default ApexTree;

/**
 * Layout, canvas, and general behaviour options for the tree chart.
 *
 * This is the largest sub-group. It covers canvas dimensions, spacing between
 * nodes, grow direction, animation, the zoom/pan toolbar, and leaf-node
 * grouping. Compose with the other sub-option interfaces via `TreeOptions`.
 */
export declare interface CommonOptions {
    /** WCAG accessibility options. Disable or customise the SVG `aria-label`. */
    readonly a11y?: A11yOptions;
    /** Arbitrary CSS injected onto the SVG root container element. */
    readonly canvasStyle: string;
    /** Vertical distance between a parent node and its children in pixels. @default 50 */
    readonly childrenSpacing: number;
    /** CSS class name for the root SVG container element. @default 'root' */
    readonly containerClassName: string;
    /** Key in the data object used as the node display label. @default 'name' */
    readonly contentKey: string;
    /** Direction the tree grows from the root. `'top'` | `'bottom'` | `'left'` | `'right'`. @default 'top' */
    readonly direction: TreeDirection;
    /** Animate node expansion/collapse transitions. @default true */
    readonly enableAnimation: boolean;
    /** Show the zoom/pan toolbar. @default false */
    readonly enableToolbar: boolean;
    /** Stack leaf nodes vertically instead of spreading them horizontally. @default false */
    readonly groupLeafNodes: boolean;
    /** Height of the canvas. Use `'auto'` to size to content. @default 'auto' */
    readonly height: number | string;
    /** Highlight the hovered node and its connecting edges. @default true */
    readonly highlightOnHover: boolean;
    /** Horizontal distance between sibling nodes in pixels. @default 50 */
    readonly siblingSpacing: number;
    /** Internal SVG viewport height in pixels. @default 600 */
    readonly viewPortHeight: number;
    /** Internal SVG viewport width in pixels. @default 800 */
    readonly viewPortWidth: number;
    /** Width of the canvas. Accepts a pixel number or CSS percentage string. @default '100%' */
    readonly width: number | string;
}

/**
 * Options for the edges (connecting lines) drawn between parent and child nodes.
 *
 * Controls color, hover highlight color, and stroke width.
 */
export declare interface EdgeOptions {
    /** Color of the connecting lines between nodes. @default '#A1A1A1' */
    readonly edgeColor: string;
    /** Color of connecting lines when highlighted on hover. @default '#5C6BC0' */
    readonly edgeColorHover: string;
    /** Stroke width of connecting lines in pixels. @default 1 */
    readonly edgeWidth: number;
}

/**
 * Typography options applied to the text rendered inside each node.
 *
 * These map directly to CSS font properties. Override at the `TreeOptions`
 * level for a uniform chart typeface, or use a custom `nodeTemplate` for
 * full per-node control.
 */
export declare interface FontOptions {
    /** CSS color for node text. @default '#000000' */
    readonly fontColor: string;
    /** CSS font-family for node text. Falls back to the page default when empty. */
    readonly fontFamily: string;
    /** CSS font-size for node text, e.g. `'14px'`. @default '14px' */
    readonly fontSize: string;
    /** CSS font-weight for node text. @default '400' */
    readonly fontWeight: string;
}

declare class Graph extends Paper {
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

/**
 * Recursive node structure passed to `ApexTree.render()`.
 *
 * Each node must have a unique `id` and a `name` for the display label.
 * Nest children recursively via the `children` array. Use the generic
 * parameter `T` to attach arbitrary data to each node (accessible via
 * the `data` field).
 *
 * @typeParam T - Type of the custom data payload attached to each node.
 *   Defaults to `undefined` when no custom data is needed.
 *
 * @example
 * ```ts
 * const orgChart: NestedNode = {
 *   id: 'ceo', name: 'Alice',
 *   children: [
 *     { id: 'vp1', name: 'Bob', children: [] },
 *   ],
 * };
 * ```
 */
export declare interface NestedNode<T = undefined> {
    /** Child nodes. Pass an empty array `[]` for leaf nodes. */
    readonly children: Array<NestedNode<T>>;
    /** Arbitrary data payload attached to this node. Available in callbacks. */
    readonly data: T;
    /** Unique identifier for this node. Must be stable across renders. */
    readonly id: string;
    /** Display label rendered inside the node element. */
    readonly name: string;
    /** Per-node overrides for font, border, tooltip, and other visual options. */
    readonly options?: FontOptions & NodeOptions & TooltipOptions;
}

/**
 * Visual and behavioural options for individual tree nodes.
 *
 * Controls borders, background colors, hover states, expand/collapse
 * buttons, the collapse-count badge, node dimensions, and the optional
 * custom `nodeTemplate` renderer. All fields have sensible defaults and
 * can be overridden globally via `TreeOptions` or per-node via
 * `NestedNode.options`.
 */
export declare interface NodeOptions {
    /** Border color of nodes in their default state. @default '#BCBCBC' */
    readonly borderColor: string;
    /** Border color of nodes on hover. @default '#5C6BC0' */
    readonly borderColorHover: string;
    /** CSS border-radius for nodes, e.g. `'5px'`. @default '5px' */
    readonly borderRadius: string;
    /** CSS border-style for nodes. @default 'solid' */
    readonly borderStyle: string;
    /** Border width of nodes in pixels. @default 1 */
    readonly borderWidth: number;
    /** Background color of the collapse-count badge. @default '#5C6BC0' */
    readonly collapseBadgeBGColor: string;
    /** Show the collapse-count badge on collapsed nodes. @default true */
    readonly collapseBadgeEnabled: boolean;
    /** Font color of the collapse-count badge. @default '#FFFFFF' */
    readonly collapseBadgeFontColor: string;
    /** Font size of the collapse-count badge. @default '12px' */
    readonly collapseBadgeFontSize: string;
    /** Minimum number of hidden children required before the badge appears. @default 1 */
    readonly collapseBadgeThreshold: number;
    /** Show expand/collapse buttons on nodes that have children. @default true */
    readonly enableExpandCollapse: boolean;
    /** Background color of the expand/collapse button. @default '#FFFFFF' */
    readonly expandCollapseButtonBGColor: string;
    /** Border color of the expand/collapse button. @default '#BCBCBC' */
    readonly expandCollapseButtonBorderColor: string;
    /** Spacing between stacked leaf nodes when `groupLeafNodes` is true, in pixels. @default 10 */
    readonly groupLeafNodesSpacing: number;
    /** Default background color of nodes. @default '#FFFFFF' */
    readonly nodeBGColor: string;
    /** Background color of nodes on hover. @default '#FFFFFF' */
    readonly nodeBGColorHover: string;
    /** CSS class name added to every node element. @default 'apextree-node' */
    readonly nodeClassName: string;
    /** Height of each node in pixels. @default 30 */
    readonly nodeHeight: number;
    /** Inline CSS string applied to each node element. */
    readonly nodeStyle: string;
    /** Custom function returning an HTML string rendered inside each node. */
    readonly nodeTemplate: (content: string) => string;
    /** Width of each node in pixels. @default 50 */
    readonly nodeWidth: number;
    /** Callback fired when the user clicks a node. Receives the raw node data object. */
    readonly onNodeClick?: (node: unknown) => void;
}

declare class Paper {
    protected chartContext: ChartContext;
    private readonly height;
    private readonly width;
    private readonly containerElement;
    canvas: SvgCanvas;
    constructor(element: HTMLElement, width: number, height: number, canvasStyle: string, chartContext: ChartContext);
    static drawCircle(attributes?: CircleAttr): Circle;
    static drawGroup(x?: number, y?: number, id?: string, parent?: string): G;
    static drawPath(pathString: string, { borderColor, id }?: {
        borderColor?: string | undefined;
        id?: string | undefined;
    }): Path;
    static drawRect({ color, height, opacity, radius, width, x1, y1, }?: {
        color?: string;
        height?: number;
        opacity?: number;
        radius?: number;
        width?: number;
        x1?: number;
        y1?: number;
    }): Rect;
    static drawSvgIcon(svgMarkup: string): WrappedEl;
    static drawTemplate(template: string, { nodeHeight, nodeWidth }?: Partial<NodeOptions>): ForeignObject;
    static drawText(text: string | undefined, { dx, dy, x, y }: Partial<TextAttr>): Text_2;
    add(element: WrappedEl): void;
    clear(): void;
    exportToSvg(): void;
    resetViewBox(): void;
    updateViewBox(x: number, y: number, width: number, height: number): void;
    zoom(zoomFactor: number): void;
    getContainerElement(): HTMLElement;
    /**
     * Apply WAI-ARIA tree semantics to the root SVG canvas element.
     * Sets role="tree", aria-label, and aria-multiselectable.
     */
    setTreeA11yAttributes(label: string): void;
}

/**
 * Options for the hover tooltip shown above each tree node.
 *
 * Enable with `enableTooltip: true`. Supply a `tooltipTemplate` function to
 * render custom HTML; otherwise the default template shows the node `name`.
 */
export declare interface TooltipOptions {
    /** Show a tooltip on node hover. @default false */
    readonly enableTooltip: boolean;
    /** Background color of the tooltip. @default '#FFFFFF' */
    readonly tooltipBGColor: string;
    /** Border color of the tooltip. @default '#BCBCBC' */
    readonly tooltipBorderColor: string;
    /** Font color of tooltip text. @default '#000000' */
    readonly tooltipFontColor: string;
    /** Font size of tooltip text. @default '12px' */
    readonly tooltipFontSize: string;
    /** HTML `id` for the tooltip container element. @default 'apextree-tooltip-container' */
    readonly tooltipId: string;
    /** Maximum width of the tooltip in pixels. `undefined` means unconstrained. */
    readonly tooltipMaxWidth: number | undefined;
    /** Minimum width of the tooltip in pixels. @default 100 */
    readonly tooltipMinWidth: number;
    /** Inner padding of the tooltip in pixels. Set to 0 when using a custom `tooltipTemplate`. @default 8 */
    readonly tooltipPadding: number;
    /** Custom function returning an HTML string for the tooltip content. */
    readonly tooltipTemplate?: (content: string) => string;
    /** Distance between the tooltip and the cursor in pixels. @default 10 */
    readonly tooltipOffset: number;
}

/**
 * Controls the direction the tree grows from the root node.
 *
 * - `'top'` — root at the top, children flow downward (default)
 * - `'bottom'` — root at the bottom, children flow upward
 * - `'left'` — root on the left, children flow rightward
 * - `'right'` — root on the right, children flow leftward
 */
export declare type TreeDirection = 'bottom' | 'left' | 'right' | 'top';

/**
 * Full configuration type for `ApexTree`. An intersection of all sub-option
 * interfaces: `CommonOptions & EdgeOptions & FontOptions & NodeOptions & TooltipOptions`.
 *
 * Pass a `Partial<TreeOptions>` to the constructor — all fields have defaults.
 * For per-node overrides supply `options` on individual `NestedNode` objects.
 */
export declare type TreeOptions = CommonOptions & EdgeOptions & FontOptions & NodeOptions & TooltipOptions;

export { }
