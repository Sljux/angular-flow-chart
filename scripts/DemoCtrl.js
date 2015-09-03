"use strict";

angular.module('Demo')
    .controller('DemoCtrl', function ($scope) {
        $scope.flowId = 'f55e6cc2268056d46fb80581c';

        $scope.chart = {
            options: {
                animation: false
            },
            series: ['Inside Temperature', 'Outside Temperature'],
            valueProp: ['inside.temperature', 'outside.temperature'],
            valueDefaults: 0,
            legend: true
        }
    });