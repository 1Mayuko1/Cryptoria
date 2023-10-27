const {User, UserCryptocurrencies} = require("../models/models");
const ApiError = require('../errors/ApiError')

class UserCryptocurrenciesController {
    async create(req, res){

    }

    async getAll(req, res){
        const userCrypto = await UserCryptocurrencies.findAll()
        return res.json(userCrypto)
    }

    async getAllById(req, res, next){
        const {id} = req.params

        const candidate = await User.findOne({where: {id: id}})
        if (!candidate) {
            return next(ApiError.badRequest('User not found'))
        }

        const allUserCryptocurrencies = await UserCryptocurrencies.findAll({where: {id}})
        if (!allUserCryptocurrencies) {
            return next(ApiError.badRequest('User cryptocurrencies error for some reason'))
        } else if (allUserCryptocurrencies.length <= 0) {
            return next(ApiError.badRequest('User do not have any cryptocurrencies at all'))
        }

        const cryptocurrencies = await UserCryptocurrencies.findAll({where: {id}})
        return res.json(cryptocurrencies)
    }
}

module.exports = new UserCryptocurrenciesController()
