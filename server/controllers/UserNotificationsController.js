const {User, UserNotifications} = require("../models/models");
const ApiError = require('../errors/ApiError')

class UserCryptocurrenciesController {
    async create(req, res) {
        try {
            const { userId, type, message } = req.body;

            const candidate = await User.findOne({where: {id: userId}})
            if (!candidate) {
                return res.status(400).json({ message: 'User not found' });
            }

            if (!userId || !type || !message) {
                return res.status(400).json({ message: 'Some fields missing' });
            }

            const newUserNoty = await UserNotifications.create({ userId, type, message });
            return res.json(newUserNoty);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { userId, id } = req.body;

            const candidate = await User.findOne({where: {id: userId}})
            if (!candidate) {
                return res.status(400).json({ message: 'User not found' });
            }

            if (!userId || !id) {
                return res.status(400).json({ message: 'Some fields missing' });
            }

            const noty = await UserNotifications.findOne({ where: { id: id } });
            if (!noty) {
                return res.status(404).json({ message: 'Noty not found' });
            }

            const result = await UserNotifications.destroy({
                where: { userId, id: noty.id }
            });

            if (result === 0) {
                return res.status(404).json({ message: 'User noty not found' });
            }

            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteAll(req, res, next) {
        try {
            await UserNotifications.destroy({ where: {} });
            return res.status(200).json({ message: 'All noty deleted successfully' });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res){
        const userCrypto = await UserNotifications.findAll()
        return res.json(userCrypto)
    }

    async getAllById(req, res, next){
        const {id} = req.params

        const candidate = await User.findOne({where: {id: id}})
        if (!candidate) {
            return next(ApiError.badRequest('User not found'))
        }

        const userNoty = await UserNotifications.findAll({ where: { userId: id } });
        if (!userNoty) {
            return next(ApiError.badRequest('User noty error for some reason'))
        } else if (userNoty.length <= 0) {
            return res.status(500).json({ message: 'User do not have any noty at all'});
        }

        return res.json(userNoty)
    }
}

module.exports = new UserCryptocurrenciesController()
