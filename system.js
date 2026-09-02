const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log("Someone connected:", req.method, req.url);

  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Home Car Clean backend is running.");
});

server.listen(PORT, () => {
  console.log(`Home Car Clean backend running on port ${PORT}`);
});
