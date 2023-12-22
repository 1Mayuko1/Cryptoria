import {$host} from "../http/index";

export const fetchAllCrypto = async () => {
    const {data} = await $host.get('api/cryptocurrency')
    return data
}

export const fetchAllUserCrypto = async (id) => {
    const {data} = await $host.get(`api/userCryptocurrencies/${id}`)
    return data
}

export const deleteUserCrypto = async (userId, cryptocurrencyCode) => {
    try {
        const response = await $host.delete(`api/userCryptocurrencies`, {
            data: { userId, cryptocurrencyCode }
        });
        return response.data;
    } catch (error) {
        console.log("Помилка при видаленні криптовалюти користувача:", error);
        throw error;
    }
};

export const addUserCrypto = async (userId, cryptocurrencyCode, count = 1) => {
    try {
        const response = await $host.post(`api/userCryptocurrencies`, {
            userId,
            code: cryptocurrencyCode,
            count
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getForecastInfoForCode = async (cryptoCode) => {
    try {
        const response = await $host.get(`api/forecastData/${cryptoCode}`);
        return response.data;
    } catch (error) {
        console.log('testas Error from axios', error);
    }
};

export const getHistoricalData = async (code) => {
    try {
        const response = await $host.get(`api/historicalData/${code}`);
        return response.data;
    } catch (error) {
        console.log('testas Error from axios', error);
    }
};

export const getUserNotifications = async (userId) => {
    try {
        const response = await $host.get(`api/userNotifications/${userId}`);
        return response.data;
    } catch (error) {
        console.log('testas Error from axios (getUserNotifications)', error);
    }
};

export const deleteAllUserNotifications = async () => {
    try {
        return await $host.delete(`api/userNotifications/deleteAll`);
    } catch (error) {
        console.log('testas Error from axios (deleteAllUserNotifications)', error);
    }
};

export const deleteOneUserNotification = async (userId, id) => {
    try {
        return await $host.delete(`api/userNotifications`, {
            userId,
            id
        });
    } catch (error) {
        console.log('testas Error from axios (deleteOneUserNotification)', error);
    }
};
