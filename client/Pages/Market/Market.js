import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const data = [
    { name: 'Bitcoin', code: 'BTC', price: '$39,279.19', change: '+$840.96 (2.14%)', color: '#FFD700' },
    { name: 'Litecoin', code: 'LTC', price: '$146.13', change: '+$7.20 (4.93%)', color: '#C0C0C0' },
    { name: 'Ether', code: 'ETH', price: '$1,641.17', change: '-$58.26 (3.55%)', color: '#9A9A9A' },
    { name: 'Ripple', code: 'XRP', price: '$0.76', change: '-$0.02 (2.6%)', color: '#0062FF' },
    { name: 'Cardano', code: 'ADA', price: '$1.31', change: '-$0.05 (3.8%)', color: '#3C3C3D' },
    { name: 'Polkadot', code: 'DOT', price: '$29.45', change: '+$1.13 (3.83%)', color: '#E00082' },
    { name: 'Chainlink', code: 'LINK', price: '$22.86', change: '-$0.69 (3.01%)', color: '#2A5ADA' },
    { name: 'Stellar', code: 'XLM', price: '$0.41', change: '+$0.01 (2.45%)', color: '#07ADA7' },
    { name: 'EOS', code: 'EOS', price: '$3.75', change: '-$0.14 (3.74%)', color: '#000000' },
    { name: 'Bitcoin Cash', code: 'BCH', price: '$542.21', change: '+$10.15 (1.88%)', color: '#8DC351' },
    { name: 'Dogecoin', code: 'DOGE', price: '$0.056', change: '+$0.002 (3.57%)', color: '#CBA634' },
    { name: 'Tron', code: 'TRX', price: '$0.026', change: '+$0.001 (3.85%)', color: '#F0027F' },
    { name: 'Chainlink', code: 'LINK', price: '$22.86', change: '-$0.69 (3.01%)', color: '#2A5ADA' },
];

const clearStorageToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('isAuthenticated');
    } catch (e) {
        console.error('Failed to get token from AsyncStorage', e);
    }
};

const Market = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Market
                </Text>
            </View>

            <TouchableOpacity onPress={clearStorageToken} style={styles.userIconContainer}>
                <Icon
                    style={styles.userIcon}
                    size={25}
                    name={'user'}
                />
            </TouchableOpacity>

            <View style={styles.tabsContainer}>
                <Text style={styles.tab}>All</Text>
                <Text style={styles.tab}>Top movers</Text>
                <Text style={styles.tab}>Top traded</Text>
                <Text style={styles.tab}>Recently</Text>
            </View>


            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Cryptocurrency', {
                                currencyData: item
                            });
                        }}
                    >
                        <View style={styles.listItem}>
                            <View style={[styles.icon, {backgroundColor: item.color}]}></View>
                            <View style={styles.listItemDetails}>
                                <Text style={styles.listItemName}>{item.name}</Text>
                                <Text style={styles.listItemCode}>{item.code}</Text>
                            </View>
                            <View style={styles.listItemPriceDetails}>
                                <Text style={styles.listItemPrice}>{item.price}</Text>
                                <Text style={[styles.listItemChange, item.change.startsWith('-') ? { color: 'red' } : { color: 'green' }]}>{item.change}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.code}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    tab: {
        padding: 10,
        fontWeight: 'bold'
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 15,
    },
    userIconContainer: {
        width: '100%',
        display: "flex",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    userIcon: {
        color: '#000',
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 15,
    },
    listItem: {
        flexDirection: 'row',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 6,
        backgroundColor: '#FFF'
    },
    listItemDetails: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    listItemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listItemCode: {
        color: '#aaa',
        marginTop: 5
    },
    listItemPriceDetails: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    listItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    listItemChange: {
        fontSize: 14,
        fontWeight: 'normal',
    }
});

export default Market;

