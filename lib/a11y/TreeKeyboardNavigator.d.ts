import { TreeOptions } from '../settings/Options';
import { Node } from '../models/GraphNode';

export interface NavigatorParams {
    container: HTMLElement;
    nodeMap: Record<string, Node>;
    rootNodeId: string;
    options: TreeOptions;
    onCollapse: (id: string) => void;
    onExpand: (id: string) => void;
}
/**
 * Implements the WAI-ARIA Tree View keyboard navigation pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * Responsibilities:
 * - Roving tabindex management (only one node has tabindex="0" at a time)
 * - ArrowUp/Down/Left/Right, Home, End, Enter, Space, type-ahead navigation
 * - Focus-ring application via inline style on the ForeignObject div
 * - prefers-reduced-motion detection
 */
export declare class TreeKeyboardNavigator {
    private nodeMap;
    private rootNodeId;
    private readonly container;
    private readonly options;
    private readonly onCollapse;
    private readonly onExpand;
    private focusedNodeId;
    /** When true, re-focus the previously focused node after the next update() call */
    private pendingFocusAfterUpdate;
    private typeAheadBuffer;
    private typeAheadTimer;
    private readonly boundKeyDown;
    private readonly boundDocKeyDown;
    private readonly boundFocusIn;
    /** True when the last interaction was via keyboard; false after any pointer/mouse event. */
    private isKeyboardUser;
    private readonly boundPointerDown;
    /** Reflects window.matchMedia('(prefers-reduced-motion: reduce)').matches */
    reducedMotion: boolean;
    private readonly motionQuery;
    private readonly motionChangeHandler;
    constructor(params: NavigatorParams);
    /**
     * Called after every re-render to update the internal node map and reconcile
     * the roving tabindex in the freshly created DOM.
     */
    update(nodeMap: Record<string, Node>, rootNodeId: string): void;
    private getSvgElement;
    private getGroupElement;
    /**
     * Returns all visible node IDs in depth-first pre-order.
     * Collapsed nodes' hidden children are excluded.
     */
    private getVisibleNodesInOrder;
    /** Set tabindex="0" on the focused node and tabindex="-1" on all others. */
    private updateTabIndices;
    /**
     * Move focus to a node: update roving tabindex, call .focus() on the DOM
     * element, and apply the visible focus ring only for keyboard navigation.
     */
    focusNode(nodeId: string, fromKeyboard?: boolean): void;
    private applyFocusRing;
    private removeFocusRing;
    private handleKeyDown;
    private handleTypeAhead;
    /** Returns the currently focused node ID (null if none). */
    getFocusedNodeId(): string | null;
    destroy(): void;
}
