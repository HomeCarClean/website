const http = require("http");

const {
  safetyCheck
} = require("./safety");

const {
  extraSafetyCheck,
  applyServerSafety
} = require("./extrasafety");

const PORT = 3000;

const server = http.createServer((req, res) => {

  // First safety layer
  if (!safetyCheck(req, res)) {
    return;
  }

  // Second safety layer
  if (!extraSafetyCheck(req, res)) {
    return;
  }

  console.log(
    "Someone connected:",
    req.method,
    req.url
  );

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end(
    "Home Car Clean backend is running."
  );
});

// Apply server-level connection protections
applyServerSafety(server);

server.listen(PORT, () => {
  console.log(
    `Home Car Clean backend running on port ${PORT}`
  );
});
