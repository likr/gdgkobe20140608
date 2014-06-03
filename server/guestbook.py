import json
import webapp2
from google.appengine.ext import ndb


class Greeting(ndb.Model):
    author = ndb.StringProperty()
    content = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)

    def to_dict(self):
        return {
            'author': self.author,
            'content': self.content,
            'date': self.date.strftime('%Y-%m-%d%T%H:%M:%SZ')
        }


class GreetingHandler(webapp2.RequestHandler):
    def get(self):
        greetings = Greeting.query().order(-Greeting.date)
        content = json.dumps([g.to_dict() for g in greetings])
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(content)

    def post(self):
        data = json.loads(self.request.body)
        greeting = Greeting(
            author=data.get('author'),
            content=data.get('content'))
        greeting.put()
        content = json.dumps(greeting.to_dict())
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(content)

    def options(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        self.response.headers['Access-Control-Allow-Headers'] =\
            'Origin, X-Requested-With, Content-Type, Accept'
        self.response.headers['Access-Control-Allow-Methods'] = 'GET, POST'


application = webapp2.WSGIApplication([
    ('/greetings', GreetingHandler),
])
