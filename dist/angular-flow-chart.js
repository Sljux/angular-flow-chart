"use strict";

angular.module('ngFlow.chart', ['ngFlow.websocket', 'chart.js'])
    .directive('flowChart', ['$timeout', function ($timeout) {
        controller.$inject = ['$scope'];
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                limit: '=',
                flowId: '=',
                flowSocket: '='
            },
            template: '<div ng-transclude></div>',
            link: link,
            controller: controller
        };

        function link(scope, element) {
            var socket = scope.flowSocket,
                flowId = scope.flowId,
                limit  = scope.limit;

            var data = [];

            socket.flow.search(flowId, '', limit)
                .then(function (drops) {
                    data = drops.reverse();
                    initSubscriptions();
                    scope.$broadcast('flowChart:init', data)
                });

            element.on('$destroy', function () {
                socket.flow.unsubscribe(flowId);
                scope.$broadcast('flowChart:destroy')
            });

            function initSubscriptions() {
                socket.flow.subscribe(scope.flowId, function (drop) {
                    data.push(drop);
                    scope.$broadcast('flowChart:newDrop', drop)
                });
            }
        }

        function controller($scope) {
            this.limit = $scope.limit;
        }
    }])
    .directive('flowChartJs', function () {
        return {
            restrict: 'E',
            require: '^flowChart',
            template: templateFunc,
            scope: {
                chartType:     '@',
                chartOptions:  '=',
                valueProperty: '@',
                valueDefault:  '@',
                labelProperty: '@',
                labelDefault:  '@',
                series:        '=',
                click:         '=?',
                hover:         '=?',
                legend:        '=',
                colours:       '=?'
            },
            link: link
        };

        function templateFunc(element, attrs) {
            var chartType = attrs.chartType;

            if (angular.isUndefined(chartType))
                return;

            return '<canvas class="chart chart-' + chartType + '" data="[graphData]" ' +
                'options="chartOptions" labels="labels" legend="legend" click="click" hover="hover" series="series" colours="colours"></canvas>';
        }

        function link(scope, element, attrs, flowChartCtrl) {
            var isDefined = angular.isDefined;

            var valueProperty = parseProperty(scope.valueProperty),
                labelProperty = parseProperty(scope.labelProperty),
                valueDefault  = scope.valueDefault || null,
                labelDefault  = scope.labelDefault || null,
                limit         = flowChartCtrl.limit;

            scope.graphData = [];
            scope.labels    = [];

            scope.$on('flowChart:init', function (e, data) {
                scope.graphData = parseData(data, valueProperty, valueDefault);
                scope.labels = labelProperty.length > 0 ? parseData(data, labelProperty, labelDefault) : range(scope.graphData.length);
            });

            scope.$on('flowChart:newDrop', function (e, drop) {
                scope.graphData.push(extractProperty(valueProperty, drop, valueDefault));
                var newLabel = labelProperty.length > 0 ? extractProperty(labelProperty, drop) : scope.labels[scope.labels.length - 1] + 1;
                scope.labels.push(newLabel);

                if (scope.graphData.length > limit) {
                    scope.graphData.shift();
                    scope.labels.shift();
                }
            });

            function parseData(data, property, defaultValue) {
                return data.slice(-limit).map(function (item) { return extractProperty(property, item, defaultValue) })
            }

            function extractProperty(path, object, defaultValue) {
                var value = object;

                for (var i = 0; i < path.length; i++) {
                    var key = path[i];

                    if (isDefined(value[key])) {
                        value = value[key]
                    } else {
                        value = defaultValue;
                        break;
                    }
                }

                return value;
            }

            function parseProperty(prop) {
                return prop ? prop.split('.') : []
            }

            function range(n) {
                var result = Array(n);

                for (var i = 0; i < n; i++) { result[i] = i }

                return result;
            }
        }
    });