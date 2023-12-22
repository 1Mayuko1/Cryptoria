const { HistoricalData} = require('../models/models')
const ApiError = require('../errors/ApiError')

class HistoricalDataController {
    async create(req, res, next){
        try {
            const { cryptocurrencyId, date, data, cryptoCode } = req.body;
            if (cryptocurrencyId && date && data && cryptoCode) {
                const createdData = await HistoricalData.findOne({
                    where: {
                        cryptoCode,
                    },
                });
                if (createdData) {
                    await createdData.update({ cryptocurrencyId, data, date });
                    return res.json(createdData);
                } else {
                    const cryptocurrencyData = await HistoricalData.create({cryptocurrencyId, date, data, cryptoCode})
                    return res.json(cryptocurrencyData);
                }
            } else {
                return next(ApiError.badRequest(`Some fields did not exist`));
                // return next(ApiError.badRequest('Some fields did not exist', [{cryptocurrencyId: cryptocurrencyId, cryptoCode: cryptoCode, date: date, data: data}]))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res){
        let cryptocurrencies = await HistoricalData.findAll()
        return res.json(cryptocurrencies)
    }

    async getOneById(req, res, next){
        const { code } = req.params
        const cryptocurrency = await HistoricalData.findOne({where: {cryptoCode: code}});
        if (cryptocurrency) {
            return res.json(cryptocurrency)
        } else {
            const cryptocurrencyMocData = await HistoricalData.findOne({where: {cryptoCode: 'LTC'}});
            if (cryptocurrencyMocData) {
                return res.json(cryptocurrencyMocData)
            } else {
                return next(ApiError.badRequest('Not found that cryptocurrency data by id'))
            }
        }
    }

    async deleteAll(req, res, next) {
        try {
            await HistoricalData.destroy({ where: {} });
            return res.status(200).json({ message: 'All cryptocurrencies forecast deleted successfully' });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new HistoricalDataController()
