import React, { useEffect, useState } from 'react';
import { Dimensions } from "react-native";

export const colors = {
    crystal: '#A6DAD9',
    beige: '#F5EEDF',
    whiteChocolate: '#EEE7D3',
    bone: '#EAD7C3',
    almond: '#F5D9C4',
    orchidPink: '#ECC1D1',
    thistle: '#D9B4E2',
    tropicalViolet: '#BEAFE1',
    purple: '#694fad',
    pastelRed: '#ffc1ae',
    pastelBlue: '#5a9ae6',

    lilac: '#BEADC9',
    palePink: '#FAD6D6',
    cambridgeBlue: '#92C5BA',
    //
    pastelGray: '#86729b',
    wildBlue: '#5796af',
    shadowBlue: "#5796af",
    shadowBrown: '#B89276',
    //
    border: 'rgb(199, 199, 204)',
    text: 'rgb(28, 28, 30)',
    notification: 'rgb(255, 69, 58)',
}

export const BtnTheme = {
    dark: false,
    colors: {
        primary: colors.shadowBlue,
        background: colors.shadowBlue,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
    },
};

export const SearchBarTheme = {
    dark: false,
    colors: {
        primary: colors.shadowBlue,
        background: colors.shadowBlue,
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

export const CalendarTheme = {
    calendarBackground: colors.shadowBlue,
    selectedDayBackgroundColor: "#333",
    selectedDayTextColor: "#333",
    selectedDotColor: colors.pastelGray,
    dayTextColor: colors.beige,
    textDisabledColor: '#c0c0c0',
    dotColor: colors.beige,
    monthTextColor: colors.beige,
    textMonthFontWeight: 'bold',
    arrowColor: colors.beige,
    todayTextColor: colors.beige
};

export const AddBtnTheme = {
    dark: false,
    colors: {
        primary: colors.pastelGray,
        background: colors.pastelGray,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
    },
};

export const CancelBtnTheme = {
    dark: false,
    colors: {
        primary: colors.pastelRed,
        background: colors.pastelRed,
        card: colors.almond,
        text: colors.text,
        border: colors.border,
        notification: colors.notification,
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
