# angular-flow-chart

Real-time charts for IoT using Angular and FlowThings. Uses the official [FlowThings Angular Client](https://github.com/flowthings/angular-client)
for communication with FlowThings server.

Install via Bower
```sh
bower install angular-flow-chart --save
```

Include the scripts
```html
<script src="bower_components/Chart.js/Chart.js"></script> <!-- Chart.js -->
<script src="bower_components/angular-chart.js/dist/angular-chart.min.js"></script> <!-- Angular Chart.js -->
<script src="bower_components/flowthings-browser/dist/flowthings-browser.min.js"></script> <!-- FlowThings Browser -->
<script src="bower_components/flowthings-angular/dist/flowthings-angular.min.js"></script> <!-- FlowThings Angular -->
<script src="bower_components/angular-flow-chart/dist/angular-flow-chart.min.js"></script> <!-- Angular Flow Charts -->
```

Include the `ngFlowChart` module as a dependency to your module:
```js
angular.module('app', ['ngFlowChart'])
```

## Flow Chart
__flowChart__ directive serves as a base for communication with FlowThings server, initializes data and passes any incoming data to the chart.
Any actual chart is handled by plugin directives transcluded within the `<flow-chart></flow-chart>` tag.

### Options
- `flowId`: id of the source Flow
- `limit`: max number od data points in the graph - used in initial data fetching and passed down to chart plugin

### Transclusion Controller
- Exposes `limit` in the controller, so it is available to transcluded charts

### Events
- `flowChart:init`: fired upon initialisation, initial drops passed to subscribers
- `flowChart:newDrop`: fired when new drop arrives, passing it to the subscribers


For more info on how to build chart plugin, refer to [Angular Flow ChartJS Plugin](https://github.com/Sljux/angular-flow-chartjs)