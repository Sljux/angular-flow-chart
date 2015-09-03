angular.module('flowthings', [])
  .factory('ftBackend', function() {
    if (typeof require === 'function' && typeof exports === 'object') {
      return require('flowthings-browser');
    } else if (typeof flowthings === 'object') {
      return flowthings;
    } else {
      throw new Error('flowthings-browser required');
    }
  })
  .factory('ftRequest', ['$http', function($http) {
    return function(options, callback) {
      if (options.params && (options.params.timeout || options.params.cache)) {
        options.params = angular.extend({}, options.params);
        options.timeout = options.params.timeout;
        options.cache = options.params.cache;
        delete options.params.timeout;
        delete options.params.cache;
      }
      $http(options)
        .then(function(res) { callback(null, res.data) })
        .catch(function(err) { callback(err) });
    }
  }])
  .value('ftWebSocket', WebSocket)
  .provider('flowthings', function() {
    var provider = this;
    provider.options = {};
    provider.$get = ['ftBackend', 'ftRequest', 'ftWebSocket', '$q', '$rootScope', function(backend, request, WebSocket, $q, $rootScope) {
      var options = angular.extend({}, backend.options, provider.options, {
        transform: function(next) {
          return $q(function(resolve, reject) {
            next(function(err, res) {
              if (err != null) {
                reject(err);
              } else {
                resolve(res);
              }
              if ($rootScope.$$phase == null) {
                $rootScope.$apply();
              }
            });
          });
        },
        serializer: {
          stringify: angular.toJson,
          parse: JSON.parse
        }
      });
      var client = backend.APIClient(options, request, WebSocket);
      var _connect = client.ws.connect;
      var _subscribe = client.ws.subscribe;
      client.ws.connect = function() {
        return _connect().then(function(ws) {
          ws.onopen = function() { $rootScope.$broadcast('flowthings:open', ws) };
          ws.onerror = function() { $rootScope.$broadcast('flowthings:error') };
          ws.onclose = function(e) { $rootScope.$broadcast('flowthings:close', e) };
          return ws;
        });
      };
      client.ws.subscribe = function(path, handler, scope) {
        var unwatch = scope ? scope.$on('$destroy', unsubscribe) : angular.noop;
        function unsubscribe() {
          unwatch();
          return client.ws.unsubscribe(path, applyHandler);
        }
        function applyHandler(data) {
          $rootScope.$apply(function() {
            handler(data);
          });
        }
        return {
          result: _subscribe(path, applyHandler),
          unsubscribe: unsubscribe
        }
      };
      return client;
    }];
  });
