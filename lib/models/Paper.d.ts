import { NodeOptions } from '../settings/Options';
import { ChartContext, Circle, CircleAttr, ForeignObject, G, Path, Rect, SvgCanvas as Svg, Text, TextAttr, WrappedEl } from '../../../../graph-utils/src/index.ts';

export declare class Paper {
    protected chartContext: ChartContext;
    private readonly height;
    private readonly width;
    private readonly containerElement;
    canvas: Svg;
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
    static drawText(text: string | undefined, { dx, dy, x, y }: Partial<TextAttr>): Text;
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
