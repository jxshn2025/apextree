import { TreeOptions } from './settings/Options';
import { Graph, NestedNode } from './models';
import { BaseChart } from '../../../graph-utils/src/index.ts';

export declare class ApexTree extends BaseChart {
    graph: Graph;
    options: TreeOptions;
    constructor(element: HTMLElement, options?: Partial<TreeOptions>);
    static setLicense(key: string): void;
    private setupElementDimensions;
    /**
     * Handle watermark display based on license validation
     */
    private handleWatermark;
    render(data: NestedNode): Graph;
}
