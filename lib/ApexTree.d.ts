import { TreeOptions } from './settings/Options';
import { Graph, NestedNode } from './models';

export declare class ApexTree {
    element: HTMLElement;
    graph: Graph;
    options: TreeOptions;
    constructor(element: HTMLElement, options: TreeOptions);
    static setLicense(key: string): void;
    /**
     * Handle watermark display based on license validation
     */
    private handleWatermark;
    render(data: NestedNode): Graph;
}
