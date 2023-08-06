import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userCryptocurrencies = [
            { id: 1, userId: 1, cryptocurrencyId: 1, count: '100', date: '2023-08-06' },
            { id: 2, userId: 2, cryptocurrencyId: 2, count: '150', date: '2023-07-06' },
            { id: 3, userId: 3, cryptocurrencyId: 3, count: '200', date: '2023-06-06' },
            { id: 4, userId: 4, cryptocurrencyId: 1, count: '250', date: '2023-05-06' },
            { id: 5, userId: 5, cryptocurrencyId: 2, count: '300', date: '2023-04-06' },
        ];

        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setUserCryptocurrencies(cryptocurrencies) {
        this._userCryptocurrencies = cryptocurrencies
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get userCryptocurrencies() {
        return this._userCryptocurrencies
    }
}