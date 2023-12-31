import React, {createContext} from 'react';
import { LogBox } from "react-native";
// import UserStore from './store/UserStore'
// import UserCryptoStore from "./store/userCryptoStore";
// import CryptoStore from "./store/cryptoStore";
import AppContainer from "./AppContainer";
import UserStore from "./store/userStore";
import UserCryptoStore from "./store/userCryptoStore";

LogBox.ignoreLogs([""]);

export const Context = createContext(null)

export default function App() {

    return (
        <Context.Provider value={{
            user: new UserStore(),
            userCrypto: new UserCryptoStore()
            // userCryptocurrency: new UserCryptoStore(),
            // cryptocurrency: new CryptoStore()
        }}>
            <AppContainer />
        </Context.Provider>
    );
}
