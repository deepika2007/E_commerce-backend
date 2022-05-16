const tryCatchBlock = (req, res, next) => {
  console.log(' console from try and catch ')
  Promise.resolve(tryCatchBlock(req, res, next)).catch(next)
}
module.exports = tryCatchBlock