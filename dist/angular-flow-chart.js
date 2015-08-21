'use strict';

angular.module('ngFlowChart', ['flowthings', 'chart.js'])
    .directive('flowChart', flowChartFactory);

function flowChartFactory(flowthings) {
    controller.$inject = ['$scope'];
    return {
        restrict: 'AE',
        transclude: true,
        scope: {
            flowId: '=',
            limit:  '='
        },
        template: '<div ng-transclude></div>',
        link: link,
        controller: controller
    };

    function link(scope) {
        var flowId = scope.flowId,
            limit  = scope.limit || 20;

        var data = [];

        flowthings.drop(flowId).find({ limit: limit })
            .then(function (drops) {
                data = drops.body.reverse();
                initSubscriptions();
                scope.$broadcast('flowChart:init', data)
            });

        function initSubscriptions() {
            flowthings.ws.subscribe(scope.flowId, onMessage, scope);

            function onMessage(drop) {
                data.push(drop);
                scope.$broadcast('flowChart:newDrop', drop)
            }
        }
    }

    function controller($scope) {
        this.limit = $scope.limit;
    }
}
flowChartFactory.$inject = ['flowthings'];