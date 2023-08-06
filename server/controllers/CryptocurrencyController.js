const { Cryptocurrency, CryptocurrencyDescription } = require('../models/models')
const ApiError = require('../errors/ApiError')
const uuid = require('uuid')

class CryptocurrencyController {
    async create(req, res, next){
        try {
            const { name, symbol, info} = req.body
            let cryptocurrencyDescription = info
                if (name && symbol) {
                    const cryptocurrency = await Cryptocurrency.create({name, symbol})

                    if (cryptocurrencyDescription) {
                        cryptocurrencyDescription = JSON.parse(cryptocurrencyDescription)
                        cryptocurrencyDescription.forEach(i =>
                            CryptocurrencyDescription.create({
                                title: i.title,
                                description: i.description,
                                cryptocurrencyId: cryptocurrency.id
                            })
                        )
                    }

                    return res.json(cryptocurrency)
                } else {
                    return next(ApiError.badRequest('Some fields did not exist'))
                }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit
        let cryptocurrencies;
        cryptocurrencies = await Cryptocurrency.findAndCountAll({limit, offset})
        return res.json(cryptocurrencies)
    }

    async getOneById(req, res, next){
        const { id } = req.params
        const cryptocurrency = await Cryptocurrency.findOne(
            {
                where: {id},
                include: [{model: CryptocurrencyDescription, as: 'info'}]
            },
        )
        if (cryptocurrency) {
            return res.json(cryptocurrency)
        } else {
            return next(ApiError.badRequest('Not found that cryptocurrency by id'))
        }
    }
}

module.exports = new CryptocurrencyController()