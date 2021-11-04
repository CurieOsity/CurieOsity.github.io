import os
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

class test_server(Handler):
    def do_GET(self):
        path = self.translate_path(self.path)

        # If the path doesn't exist, fake it to be the 404 page.
        if not os.path.exists(path):
            self.path = '/404.html'

        # Call the superclass methods to actually serve the page.
        Handler.do_GET(self)


with socketserver.TCPServer(("", PORT), test_server) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
