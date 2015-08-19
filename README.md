# angular-flow-chart

Real-time charts for Angular and FlowThings. Uses the official [FlowThings Angular Client](https://github.com/flowthings/angular-client)
for communication with FlowThings server.

Install via Bower
```sh
bower install angular-flow-chart --save
```

Add script tag to your `index.html`
```html
<script src="bower_components/angular-flow-chart.js"></script>
```

Include the `ngFlowChart` module as a dependency to your module:
```js
angular.module('app', ['ngFlowChart'])
```

## Flow Chart
__flowChart__ directive serves as a base for communication with FlowThings server, initializes data and passes any incoming data to the chart.
Any actual chart is a plugin directive transcluded within the `<flow-chart></flow-chart>` tag.

### Options
- `flowId`: id of the source Flow
- `limit`: max number od data points in the graph - used in initial data fetching and passed down to chart plugin

### Transclusion Controller
- Exposes `limit` in the controller, so it is available to transcluded charts

### Events
- `flowChart:init`: fired upon initialisation, initial drops passed to subscribers
- `flowChart:newDrop`: fired when new drop arrives, passing it to the subscribers


For more info on how to build chart plugin, refer to [Angular Flow ChartJS Plugin](https://github.com/Sljux/angular-flow-chartjs)