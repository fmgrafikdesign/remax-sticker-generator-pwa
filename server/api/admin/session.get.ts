export default defineEventHandler(event => {
  requireAdmin(event)
  setResponseStatus(event, 204)
  return null
})
