export default function generateErrorResponse(error) {
  if (!error) return 'An error occurred.'
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors || {}).map((e) => e.message)
    return `Validation error(s): ${messages.join('; ')}`
  }
  if (error.code === 11000) {
    // Mongo duplicate key error
    const field = Object.keys(error.keyPattern || {})[0] || 'field'
    return `A record with that ${field} already exists.`
  }
  return error.message || 'An error occurred.'
}
