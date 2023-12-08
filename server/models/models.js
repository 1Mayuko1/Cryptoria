const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
})

const UserCryptocurrencies = sequelize.define('userCryptocurrencies', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    cryptocurrencyId: { type: DataTypes.INTEGER },
    count: { type: DataTypes.STRING },
})

const Cryptocurrency = sequelize.define('cryptocurrency', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
    code: { type: DataTypes.STRING, unique: false },
})

const UserNotifications = sequelize.define('userNotifications', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING, unique: false },
    message: { type: DataTypes.TEXT, unique: false },
})

const ExchangeRates = sequelize.define('exchangeRates', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cryptocurrencyId: { type: DataTypes.INTEGER },
    priceUSD: { type: DataTypes.STRING },
    priceEUR: { type: DataTypes.STRING },
    priceUAH: { type: DataTypes.STRING },
    timestamp: { type: DataTypes.STRING, defaultValue: 'no time stamp'},
})

const CryptocurrencyDescription = sequelize.define('cryptocurrencyDescription', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

Cryptocurrency.hasMany(CryptocurrencyDescription, {as: 'info'});
CryptocurrencyDescription.belongsTo(Cryptocurrency)

UserCryptocurrencies.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId', as: 'cryptocurrency' });
Cryptocurrency.hasMany(UserCryptocurrencies, { foreignKey: 'cryptocurrencyId' });

module.exports = {
    User,
    Cryptocurrency,
    UserCryptocurrencies,
    ExchangeRates,
    CryptocurrencyDescription,
    UserNotifications
}
