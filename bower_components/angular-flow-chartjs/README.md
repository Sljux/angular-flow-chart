# Flow ChartJS
__flowChartJs__ is an example of chart plugin for [Angular Flow Chart](https://github.com/Sljux/angular-flow-chart), 
using [ChartJS](https://github.com/nnnick/Chart.js) via [Angular Chart](http://jtblin.github.io/angular-chart.js/)

Install via Bower
```sh
bower install angular-flow-chartjs --save
```

Add script tag to your `index.html`
```html
<script src="bower_components/angular-flow-chartjs.js"></script>
```

Include the `ngFlowChartJs` module as a dependency to your module:
```js
angular.module('app', ['ngFlowChartJs', 'ngFlowChart'])
```

## Options
- `chartType`: `string` representing one of chart types supported by ChartJS (line, bar, radar, pie, polar-area, doughnut)
- `chartOptions`: options `object` to be passed to ChartJS (check the [official docs](http://www.chartjs.org/docs/) for more info)
- `valueProperties`: `string` or an `array of strings` each representing a path to property of the data point object to be used as graph value. 
If array is passed, a graph will be drawn for each path. Should be in `path.to.prop` form
- `valueDefaults`: `number` or an `array of numbers` to be used as a default if the data point object doesn't contain property in the given path.
Defaults to `null`, resulting in graph points not being drawn. If a single value is passed, it will be used as default for all graphs
- `labelProperty`: `string` representing a path to property of the data point object to be used as chart label. Should be in `path.to.prop` form.
If nothing is passed, the labels are auto incremented integers starting at 0
- `labelDefault`: used if `labelProperty` is passed. `Number` representing default label value if the data point object 
doesn't contain property in the given label path
- `series`, `click`, `hover`, `legend` and `colours` are directly passed to [Angular Chart](http://jtblin.github.io/angular-chart.js/) directive

## Example usage
```html
<!-- main.html -->

<flow-chart flow-id="flowId" limit="20">
    <flow-chart-js
        value-properties="chart.valueProp"
        value-defaults="chart.valueDefaults"
        chart-type="line"
        chart-options="chart.options"
        series="chart.series"
        legend="chart.legend">
    </flow-chart-js>
</flow-chart>
```

```js
/* main.js */

angular.module('ngFlowThingsApp')
    .controller('MainCtrl', function ($scope) {
        $scope.flowId = '< your Flow ID >';

        $scope.chart = {
            options: {
                animation: false
            },
            series: ['Inside Temperature', 'Outside Temperature'],
            valueProp: ['inside.temperature', 'outside.temperature'],
            /* or valueProp: 'inside.humidity' */
            valueDefaults: 0,
            /* or valueDefaults: [3, -7] */
            legend: true
        }
    });
```