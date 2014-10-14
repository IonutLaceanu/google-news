from tornado import ioloop, web, websocket, escape
import os
import requests

class IndexHandler(web.RequestHandler):
  def get(self):
    self.render("index.html")

class ProxyHandler(websocket.WebSocketHandler):
  def open(self):
    pass
  
  def on_message(self, message):
    # message added to keep alive the heroku connection
    if message == 'keepalive':
      return
    
    # sets the url and decode the json received through websocket
    url = 'https://ajax.googleapis.com/ajax/services/search/news'
    request = escape.json_decode(message)
    
    # create the payload and make the request
    payload = { 'v' : '1.0'}
    payload.update(request)
    results = {
      'request' : request,
      'response' : requests.get(url, params=payload).json()
    }

    # send the response, together with the initial request, to the client
    self.write_message(escape.json_encode(results))

  def on_close(self):
    pass

settings = {
  "template_path": os.path.join(os.path.dirname(__file__), "templates"),
  "static_path": os.path.join(os.path.dirname(__file__), "static"),
}

application = web.Application([
  (r'/wss', ProxyHandler),
  (r'/.*', IndexHandler),
],**settings)

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  application.listen(port)
  ioloop.IOLoop.instance().start()