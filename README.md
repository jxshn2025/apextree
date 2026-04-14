# ApexTree - Installation and Getting started

The Apextree is a javascript library built on SVG that helps to create organizational or hierarchical charts.

<img width="811" alt="Screenshot 2023-12-17 at 10 28 04 PM" src="https://github.com/apexcharts/tree/assets/17950663/e09212ec-6322-4c68-ac12-9afc524d2abd">

## Installation

To add the Apextree to your project and its dependencies, install the package from npm.

```bash
npm install apextree
```

## Usage

```js
import ApexTree from 'apextree';
```

To create a basic tree with minimal configuration, write as follows:

```html
<div id="svg-tree"></div>
```

```js
 const data = {
   ...(nested data with format provided below)
 }
 const options = {
   width: 700,
   height: 700,
   nodeWidth: 120,
   nodeHeight: 80,
   childrenSpacing: 100,
   siblingSpacing: 30,
   direction: 'top',
   canvasStyle: 'border: 1px solid black;background: #f6f6f6;',
 };
 const tree = new ApexTree(document.getElementById('svg-tree'), options);
 const graph = tree.render(data);
```

## Setting the License

To use ApexTree with a commercial license, set your license key before creating any chart instances:

```js
import ApexTree from 'apextree';

// set license key before creating any charts
ApexTree.setLicense('your-license-key');

const tree = new ApexTree(document.getElementById('svg-tree'), options);
const graph = tree.render(data);
```

## Tree Options

The layout can be configured by passing a second argument to `ApexTree` with the properties listed below.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | `'100%'` | Width of the canvas. Accepts a pixel number or CSS percentage string. |
| `height` | `number \| string` | `'auto'` | Height of the canvas. `'auto'` sizes to content. |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Direction the tree grows from the root node. |
| `contentKey` | `string` | `'name'` | Key in the data object used as the node display label. |
| `siblingSpacing` | `number` | `50` | Horizontal distance between sibling nodes in pixels. |
| `childrenSpacing` | `number` | `50` | Vertical distance between a parent node and its children in pixels. |
| `highlightOnHover` | `boolean` | `true` | Highlight the hovered node and its connecting edges. |
| `canvasStyle` | `string` | `''` | Arbitrary CSS injected onto the SVG root container element. |
| `enableToolbar` | `boolean` | `false` | Show the zoom/pan toolbar. |
| `enableAnimation` | `boolean` | `true` | Animate node expansion/collapse transitions. |
| `enableExpandCollapseZoom` | `boolean` | `true` | Re-fit the viewBox to the new tree bounds when a node is collapsed or expanded. When `false` the viewBox stays fixed after collapse/expand interactions. |
| `enableExpandCollapse` | `boolean` | `true` | Show expand/collapse buttons on nodes that have children. |
| `containerClassName` | `string` | `'root'` | CSS class name for the root SVG container element. |
| `nodeWidth` | `number` | `50` | Width of each node in pixels. |
| `nodeHeight` | `number` | `30` | Height of each node in pixels. |
| `nodeTemplate` | `(content: string) => string` | built-in | Custom function returning an HTML string rendered inside each node. |
| `nodeClassName` | `string` | `'apextree-node'` | CSS class name added to every node element. |
| `nodeStyle` | `string` | `''` | Inline CSS string applied to each node element. |
| `nodeBGColor` | `string` | `'#FFFFFF'` | Default background color of nodes. |
| `nodeBGColorHover` | `string` | `'#FFFFFF'` | Background color of nodes on hover. |
| `borderWidth` | `number` | `1` | Border width of nodes in pixels. |
| `borderStyle` | `string` | `'solid'` | CSS border-style for nodes. |
| `borderRadius` | `string` | `'5px'` | CSS border-radius for nodes. |
| `borderColor` | `string` | `'#BCBCBC'` | Border color of nodes in their default state. |
| `borderColorHover` | `string` | `'#5C6BC0'` | Border color of nodes on hover. |
| `onNodeClick` | `(node: unknown) => void` | `undefined` | Callback fired when the user clicks a node. Receives the raw node data object. |
| `edgeWidth` | `number` | `1` | Stroke width of connecting lines in pixels. |
| `edgeColor` | `string` | `'#A1A1A1'` | Color of connecting lines between nodes. |
| `edgeColorHover` | `string` | `'#5C6BC0'` | Color of connecting lines when highlighted on hover. |
| `groupLeafNodes` | `boolean` | `false` | Stack leaf nodes vertically instead of spreading them horizontally. |
| `groupLeafNodesSpacing` | `number` | `10` | Spacing between stacked leaf nodes in pixels. |
| `collapseBadgeEnabled` | `boolean` | `true` | Show the collapse-count badge on collapsed nodes. |
| `collapseBadgeThreshold` | `number` | `1` | Minimum number of hidden children required before the badge appears. |
| `collapseBadgeBGColor` | `string` | `'#5C6BC0'` | Background color of the collapse-count badge. |
| `collapseBadgeFontColor` | `string` | `'#FFFFFF'` | Font color of the collapse-count badge. |
| `collapseBadgeFontSize` | `string` | `'12px'` | Font size of the collapse-count badge. |
| `expandCollapseButtonBGColor` | `string` | `'#FFFFFF'` | Background color of the expand/collapse button. |
| `expandCollapseButtonBorderColor` | `string` | `'#BCBCBC'` | Border color of the expand/collapse button. |
| `enableTooltip` | `boolean` | `false` | Show a tooltip on node hover. |
| `tooltipId` | `string` | `'apextree-tooltip-container'` | HTML `id` for the tooltip container element. |
| `tooltipTemplate` | `(content: string) => string` | built-in | Custom function returning an HTML string for the tooltip content. |
| `tooltipMaxWidth` | `number \| undefined` | `undefined` | Maximum width of the tooltip in pixels. |
| `tooltipMinWidth` | `number` | `100` | Minimum width of the tooltip in pixels. |
| `tooltipBorderColor` | `string` | `'#BCBCBC'` | Border color of the tooltip. |
| `tooltipBGColor` | `string` | `'#FFFFFF'` | Background color of the tooltip. |
| `tooltipFontColor` | `string` | `'#000000'` | Font color of tooltip text. |
| `tooltipFontSize` | `string` | `'12px'` | Font size of tooltip text. |
| `tooltipPadding` | `number` | `8` | Inner padding of the tooltip in pixels. Set to `0` when using a custom `tooltipTemplate`. |
| `tooltipOffset` | `number` | `10` | Distance between the tooltip and the cursor in pixels. |
| `fontColor` | `string` | `'#000000'` | CSS color for node text. |
| `fontFamily` | `string` | `''` | CSS font-family for node text. Falls back to the page default when empty. |
| `fontSize` | `string` | `'14px'` | CSS font-size for node text. |
| `fontWeight` | `string` | `'400'` | CSS font-weight for node text. |
| `a11y` | `{ enabled?: boolean, label?: string }` | `{ enabled: true, label: 'Organizational chart' }` | WCAG accessibility: enable ARIA semantics and customise the SVG `aria-label`. |

Default node template

```js
const defaultNodeTemplate = (content: string) => {
  return `<div style='display: flex;justify-content: center;align-items: center; text-align: center; height: 100%;'>${content}</div>`;
};
```

### Expected data format

```json
{
  "id": "1",
  "name": "A",
  "children": []
}
```

Passed data object should contain id, name and children.

For _id_ key, value of id can be unique otherwise edge highlight won't work as expected.

For _name_ key, if using other than _name_ then specify key name in contentKey option

For _children_ key, it contains list of child objects

**Example**

```js
const data = {
  id: '1',
  name: 'A',
  children: [
    {
      id: '2',
      name: 'B',
      children: [
        {
          id: '3',
          name: 'C',
        },
        {
          id: '4',
          name: 'D',
        },
      ],
    },
  ],
};
```
