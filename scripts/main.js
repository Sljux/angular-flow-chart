angular.module('Demo', ['flowthings', 'ngFlowChart', 'ngFlowChartJs'])
    .config(function (flowthingsProvider) {
        flowthingsProvider.options.account = 'sljux';
        flowthingsProvider.options.token = 'm26E5C3BTxjt8QXsYxbqoL1egCTR';
    })
    .run(function(flowthings) {
        flowthings.ws.connect()
    });