angular.module('fetchApp.services', [])
.value('ws', new WebSocket('ws://' + window.location.host + '/wss'))
.value('topics', {
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