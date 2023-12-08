const { Cryptocurrency, CryptocurrencyDescription } = require('../models/models')
const ApiError = require('../errors/ApiError')
const uuid = require('uuid')

class CryptocurrencyController {
    async create(req, res, next){
        try {
            const { name, code, info} = req.body
            let cryptocurrencyDescription = info
                if (name && code) {
                    const cryptocurrency = await Cryptocurrency.create({name, code})
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

    async createMultiple(req, res) {
        try {
            const cryptocurrencies = req.body;
            if (!cryptocurrencies || cryptocurrencies.length === 0) {
                return res.status(400).json({ message: '[] - empty' });
            }

            const uniqueNames = new Set();
            const uniqueCodes = new Set();
            const filteredCryptocurrencies = cryptocurrencies.filter(crypto => {
                const { name, code } = crypto;
                if (!name || !code || uniqueNames.has(name) || uniqueCodes.has(code)) {
                    return false;
                }
                uniqueNames.add(name);
                uniqueCodes.add(code);
                return true;
            });

            const promises = filteredCryptocurrencies.map(async (crypto) => {
                const { name, code } = crypto;
                return Cryptocurrency.create({ name, code: code });
            });

            const results = await Promise.all(promises);
            return res.json(results.filter(result => result !== null));
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    async getAll(req, res){
        let { limit, page } = req.query
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit
        let cryptocurrencies;
        cryptocurrencies = await Cryptocurrency.findAll()
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

    async deleteAll(req, res, next) {
        try {
            await CryptocurrencyDescription.destroy({ where: {} });
            await Cryptocurrency.destroy({ where: {} });

            return res.status(200).json({ message: 'All cryptocurrencies and descriptions deleted successfully' });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new CryptocurrencyController()
