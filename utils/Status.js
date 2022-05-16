const RequestSuccess = (res, code, data) => {
  return res.status(code).json({ success: true, data })
}
const RequestFailure = (res, code, message) => {
  return res.status(code).json({ success: false, message })
}
module.exports = { RequestSuccess, RequestFailure }