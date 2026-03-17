import { TreeOptions } from '../settings/Options';

/**
 * Reads a CSS custom property value from an element using getComputedStyle.
 * Returns an empty string if the property is not set.
 */
export declare function readCSSVar(element: HTMLElement, name: string): string;
/**
 * Resolves TreeOptions by overriding JS option values with CSS custom property
 * values when those properties are set on the container element.
 *
 * Supported CSS custom properties:
 *   --apex-tree-node-bg            → nodeBGColor
 *   --apex-tree-node-bg-hover      → nodeBGColorHover
 *   --apex-tree-node-border        → borderColor
 *   --apex-tree-node-border-hover  → borderColorHover
 *   --apex-tree-node-border-radius → borderRadius
 *   --apex-tree-edge-stroke        → edgeColor
 *   --apex-tree-edge-stroke-hover  → edgeColorHover
 *   --apex-tree-font-family        → fontFamily
 *   --apex-tree-font-size          → fontSize
 *   --apex-tree-font-color         → fontColor
 *   --apex-tree-expand-btn-bg      → expandCollapseButtonBGColor
 *   --apex-tree-expand-btn-border  → expandCollapseButtonBorderColor
 *   --apex-tree-badge-bg           → collapseBadgeBGColor
 *   --apex-tree-badge-color        → collapseBadgeFontColor
 *   --apex-tree-badge-font-size    → collapseBadgeFontSize
 *
 * CSS custom properties take precedence over JS options.
 * JS options serve as fallbacks when no CSS variable is present.
 */
export declare function resolveCSSVars(element: HTMLElement, options: TreeOptions): TreeOptions;
