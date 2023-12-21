const { ForecastData} = require('../models/models')
const ApiError = require('../errors/ApiError')

class ForecastDataController {
    async create(req, res, next){
        try {
            const { cryptocurrencyId, data, forecastDate, cryptoCode } = req.body
            if (cryptocurrencyId && data && forecastDate && cryptoCode) {
                const createdAlreadyData = await ForecastData.findOne({
                    where: { cryptoCode },
                });
                if (!createdAlreadyData) {
                    const cryptocurrencyForecast = await ForecastData.create({cryptocurrencyId, data, forecastDate, cryptoCode})
                    return res.json(cryptocurrencyForecast)
                } else {
                    await createdAlreadyData.update({ cryptocurrencyId, data, forecastDate });
                    return res.json(createdAlreadyData);
                }
            } else {
                return next(ApiError.badRequest('Some fields did not exist'))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }


    async getAll(req, res){
        let cryptocurrencies = await ForecastData.findAll()
        return res.json(cryptocurrencies)
    }

    async getOneById(req, res, next){
        const { cryptoCode } = req.params
        if (cryptoCode) {
            const forecastData = await ForecastData.findOne(
                { where: { cryptoCode } }
            )
            if (forecastData) {
                return res.json(forecastData)
            } else {
                // return next(ApiError.badRequest(`Not found that cryptocurrency forecast for ${cryptoCode}`))
                const cryptoCode = 'LTC'
                const forecastData = await ForecastData.findOne(
                    { where: { cryptoCode } }
                )
                if (forecastData) {
                    return res.json(forecastData)
                } else {
                    return next(ApiError.badRequest(`Not found that cryptocurrency forecast for ${cryptoCode}`))
                }
            }
        } else {
            return res.json({message: `cryptoCode not found -- ${cryptoCode}`})
        }
    }

    async deleteAll(req, res, next) {
        try {
            await ForecastData.destroy({ where: {} });
            return res.status(200).json({ message: 'All cryptocurrencies forecast deleted successfully' });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new ForecastDataController()
