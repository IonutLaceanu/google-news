angular.module('fetchApp.services', [])
.factory('ws', ['$interval', function($interval) {
  var ws = new WebSocket('ws://' + window.location.host + '/wss');
  
  // send a keepalive signal every 30 secs so that heroku won't close the socket
  $interval(function() {
    try {
      ws.send('keepalive');
    }
    catch(err) {
      // it is possible to try to send the keepalive before the connection
      // I don't want to use the onopen function, because that one gets replaced
      // in the controller
      console.log('Error: ' + err.message);      
    }
  }, 30000);
  return ws;
}]).value('topics', {
  'headlines' : 'h',
  'world' : 'w',
  'business' : 'b',
  'nation' : 'n',
  'tech' : 't',
  'elections' : 'el',
  'politics' : 'p',
  'entertainment' : 'e',
  'sports' : 's',
  'health' : 'm',
})