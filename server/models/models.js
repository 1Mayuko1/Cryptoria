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

const ForecastData = sequelize.define('forecastData', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cryptocurrencyId: { type: DataTypes.INTEGER },
    data: { type: DataTypes.JSON },
    forecastDate: { type: DataTypes.STRING },
    cryptoCode: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING, defaultValue: 'no description'},
})

const CryptocurrencyDescription = sequelize.define('cryptocurrencyDescription', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const HistoricalData = sequelize.define('historicalData', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    cryptocurrencyId: {type: DataTypes.STRING, allowNull: false},
    cryptoCode: {type: DataTypes.STRING, allowNull: false},
    date: {type: DataTypes.STRING, allowNull: false},
    data: {type: DataTypes.JSON, allowNull: false},
})

UserCryptocurrencies.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId', as: 'cryptocurrency' });
Cryptocurrency.hasMany(UserCryptocurrencies, { foreignKey: 'cryptocurrencyId' });

// Встановлення зв'язків між таблицями

// User to UserCryptocurrencies (One-to-Many)
User.hasMany(UserCryptocurrencies, { foreignKey: 'userId' });
UserCryptocurrencies.belongsTo(User, { foreignKey: 'userId' });

// User to UserNotifications (One-to-Many)
User.hasMany(UserNotifications, { foreignKey: 'userId' });
UserNotifications.belongsTo(User, { foreignKey: 'userId' });

// Cryptocurrency to UserCryptocurrencies (One-to-Many)
Cryptocurrency.hasMany(UserCryptocurrencies, { foreignKey: 'cryptocurrencyId' });
UserCryptocurrencies.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

// Cryptocurrency to ExchangeRates (One-to-Many)
Cryptocurrency.hasMany(ExchangeRates, { foreignKey: 'cryptocurrencyId' });
ExchangeRates.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

// Cryptocurrency to CryptocurrencyDescription (One-to-Many)
Cryptocurrency.hasMany(CryptocurrencyDescription, { foreignKey: 'cryptocurrencyId', as: 'info' });
CryptocurrencyDescription.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

// Cryptocurrency to ForecastData (One-to-Many)
Cryptocurrency.hasMany(ForecastData, { foreignKey: 'cryptocurrencyId' });
ForecastData.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

module.exports = {
    User,
    Cryptocurrency,
    UserCryptocurrencies,
    ExchangeRates,
    CryptocurrencyDescription,
    UserNotifications,
    ForecastData,
    HistoricalData
}
