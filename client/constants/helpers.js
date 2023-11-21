import React, { useEffect, useState } from 'react';
import { Dimensions } from "react-native";

export const colors = {
    mainWhite: '#f2f2f2',
    mainBlack: '#21242d',
    mainPurple: '#99a9e7',
    highlighted: '#dbdae7',
    mainDarkPurple: '#677ccc',
    mainDarkGray: '#818991',
    mainGray: '#b4b4be',
    mainLightGray: '#e8eaf0',
    mainRed: '#f5868b',
    mainGreen: '#75c9a7',
    mainLightGreen: '#91cec3',
    mainDarkGreen: '#53ac88',
    mainBlue: '#0c99ce',
    mainLightBlue: '#57a9d6',
    mainDarkBlue: '#627eeb',
    mainDeepDark: '#293474',
    mainColor: '#728ced',
}

export const BtnTheme = {
    dark: false,
    colors: {
        primary: colors.mainColor,
        background: colors.mainColor,
        card: colors.mainWhite,
        text: colors.mainBlack,
        border: colors.mainBlack,
        notification: colors.mainGreen,
    },
};

export const SearchBarTheme = {
    dark: false,
    colors: {
        primary: colors.mainColor,
        background: colors.mainColor,
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

export const truncate = (str, maxlength) => {
    return (str.length > maxlength) ? str.slice(0, maxlength - 1) + '…' : str
}

export const round = (num) => {
    if (num.toString().indexOf('.') !== -1) {
        let spl = num.toString().split('.')
        if (spl[1].length >= 2) {
            return Math.round(num * 10) / 10
        }
    }
    return num
}

export const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}


export const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = ({ window, screen }) => {
            setScreenData(screen);
        };

        Dimensions.addEventListener('change', onChange);

        return () => { };
    }, []);

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};

export const validateRegistration = (pass, repPass, mail, userNameValue) => {

    if (typeof pass === 'string' || pass instanceof String) {

        const passwordValue = pass.trim();

        const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const minLengthRegExp = /.{8,}/;

        const emailCheck = emailRegExp.test(mail);
        const uppercasePassword = uppercaseRegExp.test(passwordValue);
        const lowercasePassword = lowercaseRegExp.test(passwordValue);
        const digitsPassword = digitsRegExp.test(passwordValue);
        const minLengthPassword = minLengthRegExp.test(passwordValue);

        if (pass.trim().length === 0) {
            return 'Поле "Пароль" пусте або містить тільки пробіл'
        } else if (repPass.trim().length === 0) {
            return 'Поле "Повторіть пароль" пусте або містить тільки пробіл'
        } else if (mail.trim().length === 0) {
            return 'Поле Email пусте або містить тільки пробіл'
        } else if (pass !== repPass) {
            return 'Паролі не співпадають'
        } else if (!emailCheck) {
            return 'Email не правильного формату'
        } else if (!uppercasePassword) {
            return 'Пароль повинен містити як мінімум одну велику літеру'
        } else if (!lowercasePassword) {
            return 'Пароль повинен містити як мінімум одну маленьку літеру'
        } else if (!digitsPassword) {
            return 'Пароль повинен містити як мінімум одну цифру'
        } else if (!minLengthPassword) {
            return 'Пароль повинен містити мінімум 8 символів'
        } else {
            return false
        }
    } else {
        return false
    }
}

export const cryptoDataValues = [
    { name: 'Bitcoin', code: 'BTC', price: '$39,279.19', change: '+$840.96 (2.14%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { name: 'Litecoin', code: 'LTC', price: '$146.13', change: '+$7.20 (4.93%)', color: '#C0C0C0', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LTC-400.png/2048px-LTC-400.png'},
    { name: 'Ether', code: 'ETH', price: '$1,641.17', change: '-$58.26 (3.55%)', color: '#9A9A9A', img: 'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo.png' },
    { name: 'Ripple', code: 'XRP', price: '$0.76', change: '-$0.02 (2.6%)', color: '#0062FF', img: 'https://w7.pngwing.com/pngs/996/864/png-transparent-coin-ripple-xrp-crypto-currency-and-coin-icon.png' },
    { name: 'Cardano', code: 'ADA', price: '$1.31', change: '-$0.05 (3.8%)', color: '#3C3C3D', img: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png' },
    { name: 'Polkadot', code: 'DOT', price: '$29.45', change: '+$1.13 (3.83%)', color: '#E00082', img: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
    { name: 'Chainlink', code: 'LINK', price: '$22.86', change: '-$0.69 (3.01%)', color: '#2A5ADA', img: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
    { name: 'Stellar', code: 'XLM', price: '$0.41', change: '+$0.01 (2.45%)', color: '#07ADA7', img: 'https://cryptologos.cc/logos/stellar-xlm-logo.png' },
    { name: 'EOS', code: 'EOS', price: '$3.75', change: '-$0.14 (3.74%)', color: '#000000', img: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/EOS-icon.png' },
    { name: 'Bitcoin Cash', code: 'BCH', price: '$542.21', change: '+$10.15 (1.88%)', color: '#8DC351', img: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Bitcoin_Cash.png' },
    { name: 'Dogecoin', code: 'DOGE', price: '$0.056', change: '+$0.002 (3.57%)', color: '#CBA634', img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
    { name: 'Tron', code: 'TRX', price: '$0.026', change: '+$0.001 (3.85%)', color: '#F0027F', img: 'https://static-00.iconduck.com/assets.00/tron-cryptocurrency-icon-2048x2029-yxsu1iic.png' },
    { name: 'AquaCoin', code: 'AQC', price: '$2.45', change: '+$0.21 (8.57%)', color: '#00BFFF', img: 'https://w7.pngwing.com/pngs/526/223/png-transparent-crypto-eth-ethcoin-etherium-crypto-currency-and-coin-icon-thumbnail.png' },
    { name: 'QuantumBit', code: 'QBT', price: '$5.89', change: '-$0.17 (2.88%)', color: '#7F00FF', img: 'https://cdn-icons-png.flaticon.com/512/9178/9178458.png' },
    { name: 'Solaris', code: 'SLR', price: '$0.98', change: '+$0.03 (3.06%)', color: '#FFD700', img: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1fca565479795.5af57de73f1bf.png' },
    { name: 'Nebula', code: 'NBL', price: '$12.34', change: '-$0.44 (3.56%)', color: '#800080', img: 'https://static-00.iconduck.com/assets.00/nebulas-cryptocurrency-icon-256x256-z441884z.png' },
    { name: 'PulseToken', code: 'PLT', price: '$0.32', change: '-$0.01 (3.12%)', color: '#FF4500', img: 'https://png.pngtree.com/png-vector/20220606/ourmid/pngtree-band-protocol-band-token-symbol-cryptocurrency-logo-png-image_4865858.png' },
    { name: 'Zenith', code: 'ZNT', price: '$7.77', change: '+$0.55 (7.08%)', color: '#32CD32', img: 'https://www.coinlore.com/img/zenith-chain.png' },
    { name: 'Galactica', code: 'GAL', price: '$15.29', change: '+$0.69 (4.51%)', color: '#1E90FF', img: 'https://e7.pngegg.com/pngimages/751/975/png-clipart-gaius-baltar-battlestar-galactica-cylon-colonial-viper-galactica-emblem-logo.png' },
    { name: 'Mythos', code: 'MTS', price: '$3.21', change: '-$0.12 (3.73%)', color: '#FF69B4', img: 'https://cryptologos.cc/logos/mithril-mith-logo.png' },
    { name: 'Elemental', code: 'ELM', price: '$1.02', change: '+$0.04 (3.92%)', color: '#B22222', img: 'https://w7.pngwing.com/pngs/339/794/png-transparent-turbomachinery-pump-symposia-comparison-shopping-website-furniture-design-kitchen-furniture-bitcoin.png' },
    { name: 'Ethereum Classic', code: 'ETC', price: '$50.75', change: '+$2.18 (4.49%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png' },
    { name: 'Tezos', code: 'XTZ', price: '$4.56', change: '+$0.15 (3.41%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/tezos-xtz-logo.png' },
    { name: 'Cosmos', code: 'ATOM', price: '$15.87', change: '-$0.29 (1.8%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/cosmos-atom-logo.png' },
    { name: 'VeChain', code: 'VET', price: '$0.096', change: '-$0.004 (4.0%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/vechain-vet-logo.png' },
    { name: 'Dash', code: 'DASH', price: '$102.54', change: '+$2.05 (2.04%)', color: '#008000', img: 'https://cryptologos.cc/logos/dash-dash-logo.png' },
    { name: 'Monero', code: 'XMR', price: '$209.45', change: '+$3.79 (1.84%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/monero-xmr-logo.png' },
    { name: 'Neo', code: 'NEO', price: '$50.20', change: '+$1.80 (3.71%)', color: '#00FF00', img: 'https://cryptologos.cc/logos/neo-neo-logo.png' },
    { name: 'Iota', code: 'MIOTA', price: '$0.98', change: '-$0.03 (2.98%)', color: '#FFA500', img: 'https://cryptologos.cc/logos/iota-miota-logo.png' },
    { name: 'Zcash', code: 'ZEC', price: '$125.75', change: '+$2.68 (2.18%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/zcash-zec-logo.png' },
    { name: 'Chaincoin', code: 'CHC', price: '$0.25', change: '+$0.01 (4.00%)', color: '#FF69B4', img: 'https://st2.depositphotos.com/47577860/46980/v/450/depositphotos_469804392-stock-illustration-chain-coin-crypto-icon.jpg' },
    { name: 'Ardor', code: 'ARDR', price: '$0.16', change: '-$0.005 (3.03%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/ardor-ardr-logo.png' },
    { name: 'Bytecoin', code: 'BCN', price: '$0.002', change: '+$0.0001 (5.26%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/bytecoin-bcn-bcn-logo.svg?v=026' },
    { name: 'Golem', code: 'GNT', price: '$0.13', change: '-$0.005 (3.70%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/golem-network-tokens-glm-logo.svg?v=026' },
    { name: 'Augur', code: 'REP', price: '$14.88', change: '-$0.38 (2.49%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/augur-rep-logo.png' },
    { name: 'DigiByte', code: 'DGB', price: '$0.02', change: '-$0.001 (4.76%)', color: '#008000', img: 'https://cryptologos.cc/logos/digibyte-dgb-logo.png' },
    { name: 'Ravencoin', code: 'RVN', price: '$0.08', change: '-$0.002 (2.44%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png' },
    { name: 'Bitcoin Gold', code: 'BTG', price: '$28.65', change: '+$0.45 (1.59%)', color: '#FF69B4', img: 'https://cryptologos.cc/logos/bitcoin-gold-btg-logo.png' },
    { name: 'Horizen', code: 'ZEN', price: '$37.22', change: '+$0.72 (1.98%)', color: '#32CD32', img: 'https://static-00.iconduck.com/assets.00/horizen-cryptocurrency-icon-2048x2048-xfdrj55v.png' },
    { name: 'Komodo', code: 'KMD', price: '$1.37', change: '-$0.04 (2.83%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/komodo-kmd-logo.png' },
    { name: 'Qtum', code: 'QTUM', price: '$7.88', change: '+$0.18 (2.34%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/qtum-qtum-logo.png' },
    { name: 'Stratis', code: 'STRAT', price: '$1.85', change: '+$0.02 (1.09%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/stratis-strax-logo.png?v=026' },
    { name: 'Zilliqa', code: 'ZIL', price: '$0.08', change: '-$0.002 (2.44%)', color: '#008000', img: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
    { name: 'Horizen', code: 'ZEN', price: '$37.22', change: '+$0.72 (1.98%)', color: '#32CD32', img: 'https://static-00.iconduck.com/assets.00/horizen-cryptocurrency-icon-2048x2048-xfdrj55v.png' },
    { name: 'Komodo', code: 'KMD', price: '$1.37', change: '-$0.04 (2.83%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/komodo-kmd-logo.png' },
    { name: 'Qtum', code: 'QTUM', price: '$7.88', change: '+$0.18 (2.34%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/qtum-qtum-logo.png' },
    { name: 'Zilliqa', code: 'ZIL', price: '$0.08', change: '-$0.002 (2.44%)', color: '#008000', img: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
    { name: 'Neo', code: 'NEO', price: '$50.20', change: '+$1.80 (3.71%)', color: '#00FF00', img: 'https://cryptologos.cc/logos/neo-neo-logo.png' },
    { name: 'Iota', code: 'MIOTA', price: '$0.98', change: '-$0.03 (2.98%)', color: '#FFA500', img: 'https://cryptologos.cc/logos/iota-miota-logo.png' },
    { name: 'Zcash', code: 'ZEC', price: '$125.75', change: '+$2.68 (2.18%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/zcash-zec-logo.png' },
    { name: 'Chaincoin', code: 'CHC', price: '$0.25', change: '+$0.01 (4.00%)', color: '#FF69B4', img: 'https://st2.depositphotos.com/47577860/46980/v/450/depositphotos_469804392-stock-illustration-chain-coin-crypto-icon.jpg' },
    { name: 'Ardor', code: 'ARDR', price: '$0.16', change: '-$0.005 (3.03%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/ardor-ardr-logo.png' },
    { name: 'Bytecoin', code: 'BCN', price: '$0.002', change: '+$0.0001 (5.26%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/bytecoin-bcn-bcn-logo.svg?v=026' },
    { name: 'Golem', code: 'GNT', price: '$0.13', change: '-$0.005 (3.70%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/golem-network-tokens-glm-logo.svg?v=026' },
    { name: 'Augur', code: 'REP', price: '$14.88', change: '-$0.38 (2.49%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/augur-rep-logo.png' },
    { name: 'DigiByte', code: 'DGB', price: '$0.02', change: '-$0.001 (4.76%)', color: '#008000', img: 'https://cryptologos.cc/logos/digibyte-dgb-logo.png' },
    { name: 'Ravencoin', code: 'RVN', price: '$0.08', change: '-$0.002 (2.44%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png' },
    { name: 'Bitcoin Gold', code: 'BTG', price: '$28.65', change: '+$0.45 (1.59%)', color: '#FF69B4', img: 'https://cryptologos.cc/logos/bitcoin-gold-btg-logo.png' },
    { name: 'Horizen', code: 'ZEN', price: '$37.22', change: '+$0.72 (1.98%)', color: '#32CD32', img: 'https://static-00.iconduck.com/assets.00/horizen-cryptocurrency-icon-2048x2048-xfdrj55v.png' },
    { name: 'Komodo', code: 'KMD', price: '$1.37', change: '-$0.04 (2.83%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/komodo-kmd-logo.png' },
    { name: 'Qtum', code: 'QTUM', price: '$7.88', change: '+$0.18 (2.34%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/qtum-qtum-logo.png' },
    { name: 'Stratis', code: 'STRAT', price: '$1.85', change: '+$0.02 (1.09%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/stratis-strax-logo.png?v=026' },
    { name: 'Zilliqa', code: 'ZIL', price: '$0.08', change: '-$0.002 (2.44%)', color: '#008000', img: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
    { name: 'Horizen', code: 'ZEN', price: '$37.22', change: '+$0.72 (1.98%)', color: '#32CD32', img: 'https://static-00.iconduck.com/assets.00/horizen-cryptocurrency-icon-2048x2048-xfdrj55v.png' },
    { name: 'Komodo', code: 'KMD', price: '$1.37', change: '-$0.04 (2.83%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/komodo-kmd-logo.png' },
    { name: 'Qtum', code: 'QTUM', price: '$7.88', change: '+$0.18 (2.34%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/qtum-qtum-logo.png' },
    { name: 'Stratis', code: 'STRAT', price: '$1.85', change: '+$0.02 (1.09%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/stratis-strax-logo.png?v=026' },
    { name: 'Zilliqa', code: 'ZIL', price: '$0.08', change: '-$0.002 (2.44%)', color: '#008000', img: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
    { name: 'NEM', code: 'XEM', price: '$0.14', change: '-$0.004 (2.74%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/nem-xem-logo.png' },
    { name: 'Holo', code: 'HOT', price: '$0.001', change: '+$0.0001 (10.00%)', color: '#FF69B4', img: 'https://cryptologos.cc/logos/holo-hot-logo.png' },
    { name: 'Decred', code: 'DCR', price: '$42.70', change: '+$0.80 (1.91%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/decred-dcr-logo.png' },
    { name: 'BitShares', code: 'BTS', price: '$0.07', change: '-$0.002 (2.86%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/bitshares-bts-logo.png' },
    { name: 'Nano', code: 'NANO', price: '$2.43', change: '-$0.05 (2.02%)', color: '#FFA500', img: 'https://cryptologos.cc/logos/nano-nano-logo.png' },
    { name: 'ICON', code: 'ICX', price: '$1.16', change: '-$0.03 (2.48%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/icon-icx-logo.png' },
    { name: 'Steem', code: 'STEEM', price: '$0.27', change: '+$0.01 (3.85%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/steem-steem-logo.png' },
    { name: 'Siacoin', code: 'SC', price: '$0.005', change: '-$0.0001 (2.00%)', color: '#008000', img: 'https://cryptologos.cc/logos/siacoin-sc-logo.png' },
    { name: 'Gnosis', code: 'GNO', price: '$93.67', change: '-$1.33 (1.40%)', color: '#00FF00', img: 'https://cryptologos.cc/logos/gnosis-gno-logo.png' },
    { name: 'Civic', code: 'CVC', price: '$0.27', change: '-$0.01 (3.57%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/civic-cvc-logo.png' },
    { name: 'Paxos Standard', code: 'PAX', price: '$1.00', change: '+$0.01 (1.00%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/paxos-standard-pax-logo.png' },
    { name: 'Revain', code: 'REV', price: '$0.01', change: '+$0.0001 (1.11%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/revain-rev-logo.png' },
    { name: 'NEXO', code: 'NEXO', price: '$1.45', change: '-$0.04 (2.68%)', color: '#8A2BE2', img: 'https://cryptologos.cc/logos/nexo-nexo-logo.png' },
    { name: 'Fantom', code: 'FTM', price: '$0.26', change: '-$0.01 (3.70%)', color: '#008000', img: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
    { name: 'Reserve Rights', code: 'RSR', price: '$0.01', change: '-$0.0001 (2.44%)', color: '#FFD700', img: 'https://cryptologos.cc/logos/reserve-rights-rsr-logo.png' },
    { name: 'Aave', code: 'AAVE', price: '$232.84', change: '+$3.20 (1.40%)', color: '#FF69B4', img: 'https://cryptologos.cc/logos/aave-aave-logo.png' },
    { name: 'Hedera Hashgraph', code: 'HBAR', price: '$0.28', change: '-$0.01 (3.45%)', color: '#32CD32', img: 'https://cryptologos.cc/logos/hedera-hashgraph-hbar-logo.png' },
    { name: 'UMA', code: 'UMA', price: '$7.48', change: '+$0.14 (1.92%)', color: '#0062FF', img: 'https://cryptologos.cc/logos/uma-uma-logo.png' },
    { name: 'Swipe', code: 'SXP', price: '$2.08', change: '-$0.03 (1.43%)', color: '#FFA500', img: 'https://cryptologos.cc/logos/swipe-sxp-logo.png' },
    { name: 'Balancer', code: 'BAL', price: '$22.44', change: '-$0.72 (3.12%)', color: '#FF4500', img: 'https://cryptologos.cc/logos/balancer-bal-logo.png' },
];

export const processCurrencyDataForText = (data) => {
    const processedData = [];

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const previous = data[i - 1] || null;

        const priceSuccess = previous ? current.close > previous.close : false;

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - (15 - i));
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        const pricePercent = previous ? ((current.close - previous.close) / previous.close * 100).toFixed(2) : 0;
        const priceNumber = previous ? (current.close - previous.close).toFixed(3) : 0;

        processedData.push({
            priceSuccess,
            date: formattedDate,
            pricePercent: `${pricePercent}%`,
            priceNumber: `${priceNumber > 0 ? '+' : ''}${priceNumber}`
        });
    }

    return processedData;
}
