export interface NodePosition {
    x: number;
    y: number;
}
export declare class PositionManager {
    private positions;
    private originalPositions;
    /**
     * Store the initial layout positions (called after first render)
     */
    storeInitialLayout(graph: any): void;
    /**
     * Store current positions of all nodes
     */
    storeCurrentPositions(graph: any): void;
    /**
     * Get stored position for a node
     */
    getStoredPosition(nodeId: string): NodePosition | undefined;
    /**
     * Get original position for a node (from initial layout)
     */
    getOriginalPosition(nodeId: string): NodePosition | undefined;
    /**
     * Check if a node has a stored position
     */
    hasStoredPosition(nodeId: string): boolean;
    /**
     * Apply stored positions to graph nodes, preserving original positions where possible
     */
    applyStoredPositions(graph: any): void;
    /**
     * Remove positions for nodes that will be hidden (but keep them for restoration)
     */
    markNodesAsHidden(nodeIds: string[]): void;
    /**
     * Clean up positions for nodes that no longer exist in the data structure
     */
    cleanupRemovedNodes(existingNodeIds: Set<string>): void;
    /**
     * Calculate positions for newly added nodes based on their parent's position
     * and the original layout structure
     */
    calculatePositionsForNewNodes(graph: any, expandedParentId: string, newChildIds: string[], options: any): void;
    /**
     * Calculate position for a completely new child node
     */
    private calculateNewChildPosition;
    /**
     * Clear all stored positions
     */
    clear(): void;
    /**
     * Reset to only keep original positions (for layout changes)
     */
    resetToOriginal(): void;
}
