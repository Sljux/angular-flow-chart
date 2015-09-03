flowthings-browser-client
=========================

## Install

NPM
```
npm install flowthings-browser
```

Bower
```
bower install flowthings-browser
```

## Example

```js
var path = '/my/flow/path';
var api = flowthings.API({
  account: '<account>',
  token: '<token>'
});

// Connect to WebSockets
api.ws.connect(function() {
  console.log('Connected');
});

// Subsribe to Drops
api.ws.subscribe(path, handler, function(err, res) {
  if (res) {
    console.log('Subscribed');
  }
});

function handler(drop) {
  console.log('Drop', drop);
}

// Query for the Flow
api.flow.find({ filter: { path: path }}, function(err, flow) {
  if (flow) {
    console.log('Flow', flow);
  }
});
```

## Configuration

### flowthings.API(config)

*   `account`
*   `token`

## WebSockets

### api.ws.connect([callback])

Initiates a WebSocket connection.

### api.ws.subscribe(flowIdOrPath, handler[, callback])

Subscribes to the provided Flow and invokes the handler when receiving Drops.

### api.ws.unsubscribe(flowIdOrPath, handler[, callback])

Unsubscribes the provided handler from the Flow.

### api.ws.send(command[, callback])

Sends arbitrary commands through the WebSocket API.

## REST

### api.flow.read(flowId[, params], callback)

### api.flow.findMany(params, callback)

### api.flow.find(..., callback)

Overloaded find method, dispatched on first argument.

### api.drop.create(drop[, callback])

### api.drop(flowId).create(drop[, callback])

### api.drop(flowId).update(drop[, callback])

### api.drop(flowId).save(...[, callback])

Overloaded save method, dispatched on first argument.

### api.drop(flowId).read(dropId[, params], callback)

### api.drop(flowId).findMany(params, callback)

### api.drop(flowId).find(..., callback)

Overloaded find method, dispatched on first argument.

## Promises

Anything that takes a callback can return a `Promise` instead by using the
`promisify` transform when creating your `API`. Just provide your promise
implementation of choice.

```js
var api = flowthings.API({
  account: '<account>',
  token: '<token>',
  transform: flowthings.promisify(Promise)
});

// Query for a Flow
api.flow.find({ filter: { path: '/my/path' }})
  .then(function(flow) {
    console.log('Flow', flow)
  });
```
