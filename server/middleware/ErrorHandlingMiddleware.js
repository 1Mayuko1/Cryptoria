const ApiError = require('../errors/ApiError')
const e = require("express");

module.exports = function (err, req, res, next)  {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    } else {
        return res.status(500).json({message: `-- ${err} -- Error from api, sorry lol`})
    }
}
