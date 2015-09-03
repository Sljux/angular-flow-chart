flowthings-angular-client
=========================

## Install

NPM
```
npm install flowthings-angular
```

Bower
```
bower install flowthings-angular
```

Dependencies:
*   [flowthings-browser](https://github.com/flowthings/browser-client)

## Example

```js
angular.module('app', ['flowthings'])
  .config(function(flowthingsProvider) {
    flowthingsProvider.options.account = '<account_name>';
    flowthingsProvider.options.token = '<token>';
  })
  .run(function($log, flowthings) {
    // Connect to WebSockets
    flowthings.ws.connect().then(function() {
      $log.log('Connected');
    });
  })
  .controller('MainCtrl', function($scope, flowthings) {
    $scope.drops = [];
    $scope.path = '/my/flow/path';

    // Subscribe to Drops
    var sub = flowthings.ws.subscribe($scope.path, function(drop) {
      $scope.drops.push(drop);
    });

    // Query for the Flow
    flowthings.flow.find({ filter: { path: $scope.path }}).then(function(flow) {
      $scope.flow = flow;
    });
  });
```

## Configuration

### flowthingsProvider.options

*   `account`
*   `token`

## WebSockets

### flowthings.ws.connect()

Initiates a WebSocket connection. Returns a Promise.

### flowthings.ws.subscribe(flowIdOrPath, callback[, scope])

Subscribes to the provided Flow and invokes the callback when receiving Drops.
Providing a scope will tie the subscription to the scope's lifecycle,
automatically unsubscribing when the scope is destroyed.

Returns a record of `{ unsubscribe: function, result: Promise }`

### flowthings.ws.send(command)

Sends arbitrary commands through the WebSocket API. Returns a Promise with the
response.

## REST

### flowthings.flow.read(flowId[, params])

### flowthings.flow.findMany(params)

### flowthings.flow.find(...)

### flowthings.drop.create(drop)

### flowthings.drop(flowId).create(drop)

### flowthings.drop(flowId).update(drop)

### flowthings.drop(flowId).save(...)

### flowthings.drop(flowId).read(dropId[, params])

### flowthings.drop(flowId).findMany(params)

### flowthings.drop(flowId).find(...)

## Events

### flowthings:open

Broadcasted when a WebSocket connection opens. Returns the WebSocket client.

### flowthings:error

Broadcasted when a WebSocket connection errors. Returns nothing.

### flowthings:close

Broadcasted when a WebSocket connection closes. Returns WebSocket event object.
