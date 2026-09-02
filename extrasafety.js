/*
==================================================
HOME CAR CLEAN — EXTRA SAFETY

SECOND DEFENSIVE LAYER.

This does NOT replace:
- HTTPS
- firewall rules
- tunneling / reverse proxy
- authentication where needed
- future security review

Before public Pi deployment:
REVIEW THIS FILE + safety.js AGAIN.
==================================================
*/

const MAX_BODY_SIZE = 1024 * 100; // 100 KB


/*
------------------------------------------
CHECK REQUEST SIZE
------------------------------------------

Prevents someone from claiming they are
sending an absurdly large request body.

100 KB is intentionally small for now
because Home Car Clean currently has no
reason to accept large uploads.
*/

function validContentLength(req) {
  const length = req.headers["content-length"];

  if (!length) {
    return true;
  }

  const size = Number(length);

  if (!Number.isFinite(size)) {
    return false;
  }

  if (size < 0) {
    return false;
  }

  if (size > MAX_BODY_SIZE) {
    return false;
  }

  return true;
}


/*
------------------------------------------
CHECK URL FORMAT
------------------------------------------

Makes sure Node can safely interpret
the incoming URL before the rest of the
backend does anything with it.
*/

function validURL(req) {
  try {
    new URL(
      req.url,
      "http://localhost"
    );

    return true;
  } catch {
    return false;
  }
}


/*
------------------------------------------
EXTRA REQUEST CHECK
------------------------------------------
*/

function extraSafetyCheck(req, res) {

  if (!validURL(req)) {
    res.writeHead(400, {
      "Content-Type":
        "text/plain; charset=utf-8"
    });

    res.end("Bad request.");

    return false;
  }


  if (!validContentLength(req)) {
    res.writeHead(413, {
      "Content-Type":
        "text/plain; charset=utf-8"
    });

    res.end("Request too large.");

    return false;
  }


  return true;
}


/*
------------------------------------------
SERVER CONNECTION SAFETY
------------------------------------------

Stops connections from hanging around
forever and wasting Pi resources.

These values can be changed later once
we know how the real backend behaves.
*/

function applyServerSafety(server) {

  // Maximum time allowed for a request
  server.requestTimeout = 15_000;

  // Maximum time allowed to receive headers
  server.headersTimeout = 10_000;

  // How long an idle keep-alive connection stays open
  server.keepAliveTimeout = 5_000;

  // Limit requests sent through one connection
  server.maxRequestsPerSocket = 100;
}


module.exports = {
  extraSafetyCheck,
  applyServerSafety
};
