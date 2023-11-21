import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moc_btc_v1 from './moc_btc_v1.json'
import { LineChart, BarChart } from 'react-native-chart-kit';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowDown, faArrowUp, faMagnifyingGlassDollar, faMoneyBill, faShop} from "@fortawesome/free-solid-svg-icons";
import {colors, processCurrencyDataForText} from "../../constants/helpers";
import LoadingScreen from "../Loading";


const Cryptocurrency = ({navigation, route}) => {
    const { currencyData } = route.params;
    const itemsPerPage = 4;
    const [activeChartTab, setActiveChartTab] = useState('Price')
    const [priceDataValues, setPriceDataValues] = useState([])
    const [visibleCryptoDataPrice, setVisibleCryptoDataPrice] = useState([])
    const [loading, setLoading] = useState(true);
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, []);

    useEffect(() => {
        setVisibleCryptoDataPrice(priceDataValues.slice(0, visibleItems));
    }, [visibleItems, priceDataValues]);

    const handleNavigateBack = () => {
        navigation.navigate('Market');
    }

    const last30 = moc_btc_v1.response.historical_data.slice(-15);
    const aggregatedPriceData = last30.reduce((acc, item, index) => {
        const chunkIndex = Math.floor(index / 5);
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = { ...item, count: 1 };
        } else {
            acc[chunkIndex].price_close += item.price_close;
            acc[chunkIndex].count += 1;
        }
        return acc;
    }, []).map(item => item.price_close / item.count);


    // Графік Цін (Candlestick):
    const priceData = last30.map(item => ({
        date: item.date,
        shadowH: item.price_high,
        shadowL: item.price_low,
        open: item.price_open,
        close: item.price_close,
    }));

    const processedData = processCurrencyDataForText(priceData).reverse();
    processedData.pop()

    setTimeout(() => {
        setPriceDataValues(processedData)
    }, 1000)


    // Графік Обсягу Торгів:
    const volumeData = last30.map(item => item.volume_traded);


    // Прогнозний Графік:
    const futurePriceData = {
        historical: aggregatedPriceData,
        forecast: moc_btc_v1.response.forecast.slice(-15),
    };

    // Графік Ризиків:
    const risksData = last30.map(item => item.risk);


    const Chart = ({ activeTab }) => {
        const chartConfig = {
            // fillShadowGradientOpacity: 1,
            decimalPlaces: 2,
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            color: (opacity = 1) => `#99a9e7`,
            labelColor: (opacity = 1) => `#21242d`,
            style: {
                borderRadius: 16,
            },
            propsForDots: {
                r: '3',
                strokeWidth: '2',
                stroke: '#293474'
            },
        };

        switch (activeTab) {
            case 'Price':
                return (
                    <LineChart
                        dotSize={0.5}
                        data={{
                            labels: [],
                            datasets: [{
                                data: priceData.map(item => item.close),
                            }]
                        }}
                        width={Dimensions.get('window').width - 30}
                        height={190}
                        chartConfig={chartConfig}
                        style={styles.chartWrapper}
                        bezier
                        // withDots={false}
                        // withVerticalLabels={false}
                        // withHorizontalLabels={false}
                        // withVerticalLines={false}
                        // withHorizontalLines={false}
                        // withOuterLines={false}
                    />
                );

            case 'Volume':
                return (
                    <LineChart
                        dotSize={0.5}
                        data={{
                            labels: [],
                            datasets: [{
                                data: volumeData,
                            }]
                        }}
                        width={Dimensions.get('window').width - 30}
                        height={190}
                        chartConfig={chartConfig}
                        style={styles.chartWrapper}
                        bezier
                    />
                );

            case 'Future price':
                return (
                    <LineChart
                        dotSize={0.5}
                        data={{
                            labels: [],
                            datasets: [{
                                data: futurePriceData.historical.concat(futurePriceData.forecast),
                            }]
                        }}
                        width={Dimensions.get('window').width - 30}
                        height={190}
                        chartConfig={chartConfig}
                        style={styles.chartWrapper}
                        bezier
                    />
                );

            case 'Risks':
                return (
                    <LineChart
                        dotSize={0.5}
                        strokeWidth={1.5}
                        data={{
                            labels: [],
                            datasets: [{
                                data: risksData,
                            }]
                        }}
                        width={Dimensions.get('window').width - 30}
                        height={190}
                        chartConfig={chartConfig}
                        style={styles.chartWrapper}
                        bezier
                    />
                );

            default:
                return null;
        }
    }

    if (loading) {
        return <LoadingScreen />;
    } else {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.cryptoNameContainer}>
                        <Text style={styles.cryptoPageTitle}>
                            {currencyData.name}
                        </Text>
                        <View style={styles.cryptoIconContainer}>
                            <TouchableOpacity onPress={() => {handleNavigateBack()}}>
                                <View style={styles.cryptoIconBlock}>
                                    <FontAwesomeIcon style={styles.cryptoIcon} icon={faShop} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.cryptoIconBlock}>
                                    <FontAwesomeIcon style={styles.cryptoIcon} icon={faMoneyBill} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.chartTabContainer}>
                        <Text
                            style={[styles.chartTab, activeChartTab === 'Price' && styles.activeChartTab]}
                            onPress={() => setActiveChartTab('Price')}
                        >
                            Price
                        </Text>
                        <Text
                            style={[styles.chartTab, activeChartTab === 'Future price' && styles.activeChartTab]}
                            onPress={() => setActiveChartTab('Future price')}
                        >
                            Future price
                        </Text>
                        <Text
                            style={[styles.chartTab, activeChartTab === 'Volume' && styles.activeChartTab]}
                            onPress={() => setActiveChartTab('Volume')}
                        >
                            Volume
                        </Text>
                        <Text
                            style={[styles.chartTabRisks, activeChartTab === 'Risks' && styles.activeChartTabRisks]}
                            onPress={() => setActiveChartTab('Risks')}
                        >
                            Risks
                        </Text>
                    </View>

                    <Chart activeTab={activeChartTab} />

                    <View>
                        <View style={styles.priceHistoryContainer}>
                            <FlatList
                                data={visibleCryptoDataPrice}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={styles.priceHistoryBlock}>
                                        <View style={styles.priceHistoryIconContainer}>
                                            {
                                                item.priceNumber.startsWith('-') ?
                                                    (
                                                        <View style={styles.priceHistoryIconBlock}>
                                                            <FontAwesomeIcon style={styles.priceHistoryIconDown} icon={faArrowDown} />
                                                        </View>
                                                    )
                                                    :
                                                    (
                                                        <View style={styles.priceHistoryIconBlock}>
                                                            <FontAwesomeIcon style={styles.priceHistoryIconUp} icon={faArrowUp} />
                                                        </View>
                                                    )
                                            }
                                        </View>
                                        <View style={styles.priceHistoryDatePercentContainer}>
                                            <Text style={styles.priceHistoryPercentText}>{item.pricePercent}</Text>
                                            <Text style={styles.priceHistoryDateText}>{item.date}</Text>
                                        </View>
                                        <View style={styles.priceHistoryNumberContainer}>
                                            <Text style={item.priceNumber.startsWith('+') ? styles.priceHistoryNumberTextUp : styles.priceHistoryNumberTextDown}>
                                                {item.priceNumber}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                keyExtractor={(item) => item.date}
                            />
                        </View>
                        {visibleItems < priceDataValues.length && (
                            <View style={styles.cryptoArrowDownContainer}>
                                <TouchableOpacity style={styles.cryptoArrowDownBlock} onPress={loadMore}>
                                    <FontAwesomeIcon style={styles.cryptoArrowDownIcon} icon={faArrowDown} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
};

export default Cryptocurrency;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainWhite,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    cryptoNameContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 20
    },
    cryptoPageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    cryptoIconContainer: {
        width: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    cryptoIconBlock: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35,
        borderRadius: 50,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite
    },
    cryptoIcon: {
        outlineStyle: 'none'
    },
    chartTabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    chartTab: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        minWidth: 50,
        marginRight: 15,
        borderRadius: 8,
        fontWeight: 'bold',
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainPurple,
        color: colors.mainWhite
    },
    activeChartTab: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        marginRight: 15,
        borderRadius: 8,
        fontWeight: 'bold',
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainDarkBlue,
        color: colors.mainWhite,
        opacity: 0.9
    },
    chartTabRisks: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        minWidth: 50,
        borderRadius: 8,
        fontWeight: 'bold',
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainPurple,
        color: colors.mainWhite
    },
    activeChartTabRisks: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        borderRadius: 8,
        fontWeight: 'bold',
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainDarkBlue,
        color: colors.mainWhite,
        opacity: 0.9
    },
    chartWrapper: {
        marginVertical: 8,
        borderRadius: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite,
        marginBottom: 20
    },
    cryptoArrowDownContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 38
    },
    cryptoArrowDownBlock: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35,
        borderRadius: 50,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite,
    },
    cryptoArrowDownIcon: {
        outlineStyle: 'none'
    },
    priceHistoryContainer: {
        width: Dimensions.get('screen').width - 40,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },
    priceHistoryBlock: {
        width: Dimensions.get('screen').width - 40,
        height: 65,
        flexDirection: 'row',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginRight: 5,
        padding: 10,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite
    },
    priceHistoryIconContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35,
        borderRadius: 50,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite
    },
    priceHistoryIconBlock: {

    },
    priceHistoryIconDown: {
        color: colors.mainRed
    },
    priceHistoryIconUp: {
        color: colors.mainDarkGreen
    },
    priceHistoryDatePercentContainer: {

    },
    priceHistoryPercentText: {

    },
    priceHistoryDateText: {

    },
    priceHistoryNumberContainer: {

    },
    priceHistoryNumberTextUp: {
        color: colors.mainDarkGreen
    },
    priceHistoryNumberTextDown: {
        color: colors.mainRed
    },
})
