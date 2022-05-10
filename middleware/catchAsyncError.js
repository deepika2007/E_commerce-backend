module.exports = theFunction = (req, res, next) => {
    console.log(req,'req')
    Promise.resolve(theFunction(req, res, next)).catch(next)
}