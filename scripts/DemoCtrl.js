"use strict";

angular.module('Demo')
    .controller('DemoCtrl', function ($scope) {
        $scope.flowId = 'f55e6cc2268056d46fb80581c';

        $scope.chart = {
            options: {
                animation: false,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: false,
                pointDot: false,
                datasetStrokeWidth: 0.5
            },
            series: ['Inside Noise', 'Outside Noise'],
            valueProp: ['inside.noise', 'outside.noise'],
            valueDefaults: 0,
            legend: true
        }
    });