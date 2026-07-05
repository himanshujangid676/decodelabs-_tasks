// Catches any route that doesn't exist.
function notFound(req, res, next) {
  res.status(404).json({ error: `No route: ${req.method} ${req.originalUrl}` });
}

// Last-resort handler for anything a route throws or passes to next(err).
// Keeps stack traces out of the response — the client's tone should stay calm even when the server isn't.
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
}

module.exports = { notFound, errorHandler };
