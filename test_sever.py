import os
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
class test_server(Handler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = '/404.html'
        super().do_GET()

with socketserver.TCPServer(("", PORT), test_server) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
