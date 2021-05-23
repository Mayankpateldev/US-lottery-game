
// 404 Handler
function notFound() {
  const err = new Error('Route Not Found')
  err.status = 404
  throw err
}

module.exports = {
  notFound
}
