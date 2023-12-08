import {makeAutoObservable} from "mobx";

export default class UserCryptoStore {
    constructor() {
        this._userCrypto = [];
        makeAutoObservable(this)
    }

    setUserCrypto(userCrypto) {
        this._userCrypto = userCrypto
    }

    get getUserCrypto() {
        return this._userCrypto
    }
}
