'use strict';

angular.module('ngFlowChartJs', ['ngFlowChart'])
    .directive('flowChartJs', flowChartJsFactory);

function flowChartJsFactory() {
    return {
        restrict: 'E',
        require: '^flowChart',
        template: templateFunc,
        scope: {
            chartType:       '@',
            chartOptions:    '=',
            valueProperties: '=',
            valueDefaults:   '=',
            labelProperty:   '=',
            labelDefault:    '=',
            series:          '=',
            click:           '=?',
            hover:           '=?',
            legend:          '=',
            colours:         '=?'
        },
        link: link
    };

    function templateFunc(element, attrs) {
        var chartType = attrs.chartType;

        if (angular.isUndefined(chartType))
            return;

        return '<canvas class="chart chart-' + chartType + '" data="graphData" ' +
            'options="chartOptions" labels="labels" legend="legend" click="click" hover="hover" series="series" colours="colours"></canvas>';
    }

    function link(scope, element, attrs, flowChartCtrl) {
        var isDefined = angular.isDefined,
            isArray   = angular.isArray,
            forEach   = angular.forEach;

        var valueProperties = isArray(scope.valueProperties) ? scope.valueProperties : [scope.valueProperties];
        valueProperties = valueProperties.map(formProperty);

        var labelProperty = formProperty(scope.labelProperty),
            valueDefaults = isDefined(scope.valueDefaults) ? scope.valueDefaults : null,
            labelDefault  = isDefined(scope.labelDefault)  ? scope.labelDefault  : null,
            limit         = flowChartCtrl.limit;

        scope.graphData = [];
        scope.labels    = [];

        scope.$on('flowChart:init', function (e, data) {
            scope.graphData = parseValues(data, valueProperties, valueDefaults);
            scope.labels = labelProperty ? parseLabels(data, labelProperty, labelDefault) : range(Math.min(limit, data.length));
        });

        scope.$on('flowChart:newDrop', function (e, drop) {
            var newLabel = labelProperty ? extractProperty(drop, labelProperty) : scope.labels[scope.labels.length - 1] + 1;
            scope.labels.push(newLabel);

            forEach(valueProperties, function (prop, i) {
                var valueDefault = isArray(valueDefaults) ? valueDefaults[i] : valueDefaults;
                scope.graphData[i].push(extractProperty(drop, prop, valueDefault));
            });

            if (scope.graphData[0].length > limit) {
                forEach(scope.graphData, function (_, i) {
                    scope.graphData[i].shift();
                });
                scope.labels.shift();
            }
        });

        function formProperty(prop) {
            if (!prop)
                return '';

            prop = prop.replace('.', '.value.');

            return ['elems'].concat(prop.split('.'), ['value']);
        }

        function parseValues(data, property, defaultValues) {
            data = data.slice(-limit);
            var result = Array(property.length);

            for (var i = 0; i < result.length; i++)
                result[i] = Array(data.length);

            forEach(data, function (item, i) {
                forEach(property, function (prop, j) {
                    var defaultValue = isArray(defaultValues) ? defaultValues[j] : defaultValues;
                    result[j][i] = extractProperty(item, prop, defaultValue)
                })
            });

            return result
        }

        function parseLabels(data, property, defaultValue) {
            data = data.slice(-limit);
            var result = Array(data.length);

            forEach(data, function (item, i) {
                result[i] = extractProperty(item, property, defaultValue)
            });

            return result
        }

        function extractProperty(object, path, defaultValue) {
            for (var i = 0, n = path.length; i < n; ++i) {
                var k = path[i];

                if (k in object) {
                    object = object[k];
                } else {
                    return defaultValue;
                }
            }
            return object;
        }

        function range(n) {
            var result = Array(n);

            for (var i = 0; i < n; i++) { result[i] = i }

            return result;
        }
    }
}