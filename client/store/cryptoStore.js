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
