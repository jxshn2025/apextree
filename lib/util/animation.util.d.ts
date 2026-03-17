import { TreeDirection } from '../settings/Options';

/** Duration (ms) for a single node entrance animation. */
export declare const NODE_ANIM_DURATION = 200;
/** Delay increment per depth level (ms). */
export declare const DEPTH_STAGGER_MS = 80;
/** Max stagger delay cap (ms) — prevents very deep trees from waiting too long. */
export declare const MAX_STAGGER_MS = 600;
/** Returns true when the user has requested reduced motion. */
export declare function isReducedMotion(rootElement: HTMLElement): boolean;
/**
 * Animate a node `<g>` element in with a clip-path reveal from the parent edge.
 *
 * The node is progressively uncovered from the parent-facing edge toward the
 * far edge — no scaling, so the content appears at full size and is drawn in.
 *
 * clip-path does not interact with the SVG `transform` attribute, so no
 * translate composition is needed.
 *
 * @param nodeEl      The SVG `<g>` element wrapping the node.
 * @param depth       The node's depth in the tree (root = 0).
 * @param direction   Current tree direction, used to pick reveal axis.
 * @param rootElement The chart container element (used for reduced-motion check).
 */
export declare function animateNodeEntrance(nodeEl: SVGElement, depth: number, direction: TreeDirection, rootElement: HTMLElement): void;
/**
 * Animate an SVG `<path>` edge so it appears to draw itself from the parent
 * end toward the child end.
 *
 * Uses stroke-dasharray / stroke-dashoffset technique:
 *   1. Measure path total length via `getTotalLength()`.
 *   2. Set dasharray = dashoffset = totalLength (path is invisible).
 *   3. Animate dashoffset from totalLength → 0 (path draws itself in).
 *
 * After the animation finishes the inline style override is cleaned up so
 * CSS-defined stroke-dasharray (if any) takes over cleanly.
 *
 * @param pathEl      The SVG `<path>` element.
 * @param rootElement The chart container element (used for reduced-motion check).
 * @param delay       Optional delay (ms) before the animation starts.
 */
export declare function animateEdgeDraw(pathEl: SVGPathElement, rootElement: HTMLElement, delay?: number): void;
/**
 * Animate an SVG `<path>` edge drawing itself in the hover color on mouseover,
 * or revert to the default color on mouseout.
 *
 * Uses stroke-dashoffset draw-on for mouseover and a simple opacity cross-fade
 * for mouseout (reversing a full draw-out would feel slow on hover).
 *
 * @param pathEl       The SVG `<path>` element.
 * @param hoverColor   Stroke color to use on hover.
 * @param defaultColor Stroke color to revert to on mouseout.
 * @param rootElement  The chart container element.
 */
export declare function applyEdgeHoverAnimation(pathEl: SVGPathElement, hoverColor: string, defaultColor: string, rootElement: HTMLElement): void;
