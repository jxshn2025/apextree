import { ChartContext } from '../../../../graph-utils/src/index.ts';

export interface TooltipConfig {
    readonly bgColor: string;
    readonly borderColor: string;
    readonly fontColor: string;
    readonly fontSize: string;
    readonly fontFamily: string;
    readonly maxWidth: number;
    readonly minWidth: number;
    readonly offset: number;
    readonly padding: number;
    readonly tooltipId: string;
}
export interface TooltipPosition {
    readonly placement: 'bottom' | 'left' | 'right' | 'top';
    readonly x: number;
    readonly y: number;
}
/**
 * calculate optimal tooltip position avoiding viewport edges
 */
export declare function calculateTooltipPosition(mouseX: number, mouseY: number, tooltipWidth: number, tooltipHeight: number, offset: number): TooltipPosition;
/**
 * show tooltip with content and positioning
 */
export declare function showTooltip(chartContext: ChartContext, config: TooltipConfig, content: string, mouseX: number, mouseY: number, containerElement?: HTMLElement | null): void;
/**
 * hide tooltip
 */
export declare function hideTooltip(chartContext: ChartContext, tooltipId: string): void;
