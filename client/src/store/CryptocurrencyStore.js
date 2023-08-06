import { makeAutoObservable } from 'mobx'

export default class CryptocurrencyStore {
    constructor() {
        this._cryptocurrencies = [
            { id: 1, name: 'Bitcoin', symbol: 'BTC' },
            { id: 2, name: 'Ethereum', symbol: 'ETH' },
            { id: 3, name: 'Cardano', symbol: 'ADA' },
            { id: 4, name: 'Ripple', symbol: 'XRP' },
            { id: 5, name: 'Polkadot', symbol: 'DOT' },
        ];
        this._exchangeRates = [
            { id: 1, cryptocurrencyId: 1, priceUSD: '45000', priceEUR: '38000', priceUAH: '1200000', timestamp: '2023-08-06' },
            { id: 2, cryptocurrencyId: 2, priceUSD: '3000', priceEUR: '2500', priceUAH: '80000', timestamp: '2023-08-06' },
            { id: 3, cryptocurrencyId: 3, priceUSD: '2.15', priceEUR: '1.80', priceUAH: '60', timestamp: '2023-08-06' },
            { id: 4, cryptocurrencyId: 4, priceUSD: '1.20', priceEUR: '1.00', priceUAH: '30', timestamp: '2023-08-06' },
            { id: 5, cryptocurrencyId: 5, priceUSD: '20.50', priceEUR: '17.10', priceUAH: '550', timestamp: '2023-08-06' },
        ];

        makeAutoObservable(this)
    }

    setСryptocurrencies(cryptocurrencies) {
        this._cryptocurrencies = cryptocurrencies
    }

    setExchangeRates(exchangeRates) {
        this._exchangeRates = exchangeRates
    }

    get сryptocurrencies() {
        return this._cryptocurrencies
    }

    get exchangeRates() {
        return this._exchangeRates
    }
}