/*
==================================================
FUTURE SECURITY REMINDER

This file is only defensive code.
It is NOT the full security perimeter.

Before the Raspberry Pi is exposed publicly:

- Put HTTPS / tunneling / reverse proxy in front of it.
- Do NOT expose raw port 3000 directly to the internet.
- Review firewall/network access before going live.
- Re-check security once the real backend routes exist.

==================================================
*/

const requestLog = new Map();

const MAX_REQUESTS = 60;
const WINDOW_MS = 60 * 1000;

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader("X-Frame-Options", "DENY");

  res.setHeader(
    "Referrer-Policy",
    "no-referrer"
  );

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'"
  );

  res.setHeader(
    "Cache-Control",
    "no-store"
  );
}

function validMethod(req) {
  const allowedMethods = [
    "GET",
    "POST",
    "OPTIONS"
  ];

  return allowedMethods.includes(req.method);
}

function validPath(req) {
  if (!req.url) {
    return false;
  }

  if (req.url.length > 500) {
    return false;
  }

  return true;
}

function rateLimit(req) {
  const ip =
    req.socket.remoteAddress ||
    "unknown";

  const now = Date.now();

  let record = requestLog.get(ip);

  if (!record) {
    record = {
      count: 0,
      start: now
    };

    requestLog.set(ip, record);
  }

  if (
    now - record.start >
    WINDOW_MS
  ) {
    record.count = 0;
    record.start = now;
  }

  record.count++;

  if (
    record.count >
    MAX_REQUESTS
  ) {
    return false;
  }

  return true;
}

function safetyCheck(req, res) {
  securityHeaders(res);

  if (!validMethod(req)) {
    res.writeHead(405, {
      "Content-Type": "text/plain"
    });

    res.end(
      "Method not allowed."
    );

    return false;
  }

  if (!validPath(req)) {
    res.writeHead(400, {
      "Content-Type": "text/plain"
    });

    res.end(
      "Invalid request."
    );

    return false;
  }

  if (!rateLimit(req)) {
    res.writeHead(429, {
      "Content-Type": "text/plain",
      "Retry-After": "60"
    });

    res.end(
      "Too many requests."
    );

    return false;
  }

  return true;
}

module.exports = {
  safetyCheck
};
