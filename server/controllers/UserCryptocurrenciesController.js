const {User, UserCryptocurrencies, Cryptocurrency} = require("../models/models");
const ApiError = require('../errors/ApiError')

class UserCryptocurrenciesController {
    async create(req, res) {
        try {
            const { userId, code, count = 1 } = req.body;
            const candidate = await User.findOne({where: {id: userId}})
            if (!candidate) {
                return res.json({ message: 'User not found' });
            }

            if (!userId || !code) {
                return res.json({ message: 'Some fields missing' });
            }

            const cryptocurrency = await Cryptocurrency.findOne({ where: { code } });
            if (!cryptocurrency) {
                return res.json({ message: 'Cryptocurrency not found' });
            }

            const cryptocurrencyId = cryptocurrency.id;

            const existingUserCrypto = await UserCryptocurrencies.findOne({
                where: { userId, cryptocurrencyId }
            });

            if (existingUserCrypto) {
                return res.json({ message: 'Already exist' });
            } else {
                const newUserCrypto = await UserCryptocurrencies.create({ userId, cryptocurrencyId, count });
                return res.json(newUserCrypto);
            }

        } catch (error) {
            return res.json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { userId, cryptocurrencyCode } = req.body;

            if (!userId || !cryptocurrencyCode) {
                return res.status(400).json({ message: 'Some fields missing' });
            }

            const cryptocurrency = await Cryptocurrency.findOne({ where: { code: cryptocurrencyCode } });
            if (!cryptocurrency) {
                return res.status(404).json({ message: 'Cryptocurrency not found' });
            }

            const result = await UserCryptocurrencies.destroy({
                where: { userId, cryptocurrencyId: cryptocurrency.id }
            });

            if (result === 0) {
                return res.status(404).json({ message: 'User cryptocurrency not found' });
            }

            const userCryptoData = await UserCryptocurrencies.findAll()

            return res.status(200).json({ message: 'Deleted successfully', data: userCryptoData});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res){
        const userCrypto = await UserCryptocurrencies.findAll()
        return res.json(userCrypto)
    }

    async getAllById(req, res, next){
        const { id } = req.params;

        const candidate = await User.findOne({ where: { id } });
        if (!candidate) {
            return next(ApiError.badRequest('User not found'));
        }

        const userCryptocurrencies = await UserCryptocurrencies.findAll({
            where: { userId: id },
            include: [{
                model: Cryptocurrency,
                as: 'cryptocurrency',
                attributes: ['id', 'name', 'code']
            }]
        });

        if (!userCryptocurrencies) {
            return next(ApiError.badRequest('User cryptocurrencies error for some reason'));
        } else if (userCryptocurrencies.length <= 0) {
            return res.status(500).json({ message: 'User do not have any cryptocurrencies at all'});
        }

        return res.json(userCryptocurrencies);
    }
}

module.exports = new UserCryptocurrenciesController()
