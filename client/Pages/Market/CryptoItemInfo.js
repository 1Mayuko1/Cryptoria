import React, {useEffect, useState} from 'react';
import * as RNComponents from "react-native";
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors, extractChangePercent, processCurrencyDataForText} from "../../constants/helpers";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowDown, faArrowUp, faCube} from "@fortawesome/free-solid-svg-icons";
import moc_btc from "./moc_ltc_v1.json";
import {LineChart} from "react-native-chart-kit";
import LoadingScreen from "../Loading";

const CryptoItemInfo = ({navigation, route}) => {
    const { currencyData } = route.params;
    const itemsPerPage = 3;
    const lastDay = moc_btc.response.historical_data.slice(-15);
    const lastWeek = moc_btc.response.historical_data.slice(-30);
    const lastMonth = moc_btc.response.historical_data.slice(-60);
    const [sortTimeMenuVisible, setSortTimeMenuVisible] = useState(false);
    const [sortTimeMenuOption, setSortTimeMenuOption] = useState('Today');
    const [buySellSorting, setBuySellSorting] = useState('Buy');
    const [chartData, setChartData] = useState(lastDay);
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [priceDataValues, setPriceDataValues] = useState([])
    const [visibleCryptoDataPrice, setVisibleCryptoDataPrice] = useState([])
    const [loading, setLoading] = useState(true);

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, [loading]);

    useEffect(() => {
        setVisibleCryptoDataPrice(priceDataValues.slice(0, visibleItems));
    }, [visibleItems, priceDataValues]);

    const priceDataFromChart = chartData.map(item => ({
        date: item.date,
        shadowH: item.price_high,
        shadowL: item.price_low,
        open: item.price_open,
        close: item.price_close,
    }));

    const processedData = processCurrencyDataForText(priceDataFromChart).reverse();
    processedData.pop()

    setTimeout(() => {
        setPriceDataValues(processedData)
    }, 1000)


    const handleChangeSortTimeMenu = () => {
        switch (sortTimeMenuOption) {
            case 'Today':
                setSortTimeMenuOption('Week')
                setChartData(lastWeek)
                break;
            case 'Week':
                setSortTimeMenuOption('Month')
                setChartData(lastMonth)
                break;
            case 'Month':
                setSortTimeMenuOption('Today')
                setChartData(lastDay)
                break;
        }
    }

    const handleClickBuyButton = (option) => {
        console.log('clicked Buy')
        setBuySellSorting(option)
    }

    const handleClickSellButton = (option) => {
        console.log('clicked Sell')
        setBuySellSorting(option)
    }

    const handleOpenTimeSortMenu = () => {
        setSortTimeMenuVisible(false)
        console.log('clicked Today')
    }

    const ChartComponent = ({ data }) => {
        const priceData = data.map(item => ({
            date: item.date,
            shadowH: item.price_high,
            shadowL: item.price_low,
            open: item.price_open,
            close: item.price_close,
        }));

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
                r: '1',
                strokeWidth: '1',
                stroke: '#293474'
            },
        }

        const formatNumber = (number) => {
            if (number < 1) return number.toFixed(1);
            if (number >= 1000) return `${(number / 1000).toFixed(0)}k`;
            return Math.round(number).toString();
        };

        chartConfig.formatYLabel = formatNumber;

        return (
            <View>
                <LineChart
                    data={{
                        datasets: [{
                            data: priceData.map(item => item.close),
                        }]
                    }}
                    dotSize={0.5}
                    width={Dimensions.get('window').width - 40}
                    height={200}
                    chartConfig={chartConfig}
                    style={styles.cryptoInfoChart}
                    bezier
                    withVerticalLines={false}
                    withDots={false}
                    withVerticalLabels={false}
                    // labels={getHourLabels()}
                    // formatYLabel={formatNumber}
                    // withHorizontalLabels={false}
                    // withHorizontalLines={false}
                    // withOuterLines={false}
                />
            </View>
        )
    }

    if (loading) {
        return <LoadingScreen />;
    } else {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View style={styles.topHeaderContainer}>
                            <View style={styles.headerIconBlock}>
                                <FontAwesomeIcon style={styles.headerIconImage} icon={faCube}/>
                            </View>

                            <View style={styles.headerTextBlock}>
                                <View>
                                    <RNComponents.Text
                                        style={styles.headerNameCountText}>{`1.05 ${currencyData.code}`}</RNComponents.Text>
                                </View>
                                <View style={styles.headerPricePercentText}>
                                    <View>
                                        <RNComponents.Text style={styles.headerUsdText}>USD</RNComponents.Text>
                                    </View>
                                    <View>
                                        <RNComponents.Text
                                            style={styles.headerPriceText}>{currencyData.price}</RNComponents.Text>
                                    </View>
                                    <View>
                                        <RNComponents.Text style={styles.headerPercentText}>
                                            {
                                                currencyData.change.startsWith('+') ?
                                                    '+' + extractChangePercent(currencyData.change) + '%' :
                                                    '-' + extractChangePercent(currencyData.change) + '%'
                                            }
                                        </RNComponents.Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.bottomHeaderContainer}>
                            <View style={styles.headerBuySellButtonsBlock}>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => handleClickBuyButton('Buy')}
                                        style={[styles.buyButton, buySellSorting === 'Buy' && styles.activeSellBuyButton]}
                                    >
                                        <RNComponents.Text
                                            style={[styles.buySellButtonText, buySellSorting === 'Buy' && styles.activeBuySellButtonText]}
                                        >
                                            Buy
                                        </RNComponents.Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => handleClickSellButton('Sell')}
                                        style={[styles.sellButton, buySellSorting === 'Sell' && styles.activeSellBuyButton]}
                                    >
                                        <RNComponents.Text
                                            style={[styles.buySellButtonText, buySellSorting === 'Sell' && styles.activeBuySellButtonText]}
                                        >
                                            Sell
                                        </RNComponents.Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.headerDayButtonBlock}>
                                <View>
                                    <TouchableOpacity onPress={handleChangeSortTimeMenu} style={styles.daySortingButton}>
                                        <View>
                                            <RNComponents.Text style={styles.sortMenuActiveText}>
                                                {sortTimeMenuOption}
                                            </RNComponents.Text>
                                        </View>
                                        {/*<View>*/}
                                        {/*    <FontAwesomeIcon style={styles.sortArrowIcon} icon={faSortDown} />*/}
                                        {/*</View>*/}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.chartHeaderWrapper}>
                        <View style={styles.chartHeaderCodes}>
                            <Text style={styles.chartHeaderCodeText}>{`USD / ${currencyData.code}`}</Text>
                        </View>
                        <View style={styles.chartHeaderWrapperPriceContainer}>
                            <View style={styles.chartHeaderWrapperPriceBlock}>
                                <Text style={styles.chartHeaderCodesText}>{`$${priceDataValues[0].priceNumber.slice(1)}`}</Text>
                            </View>
                            <View style={styles.chartHeaderPriceText}>
                                {
                                    priceDataValues[0].priceNumber.startsWith('-') ?
                                        <Text style={styles.redPriceChart}>{`${priceDataValues[0].pricePercent}`}</Text> :
                                        <Text style={styles.greenPriceChart}>{`${priceDataValues[0].pricePercent}`}</Text>
                                }
                            </View>
                        </View>
                    </View>

                    <View>
                        <ChartComponent data={chartData}/>
                    </View>

                    <View style={styles.priceHistoryWrapper}>
                        <View style={styles.priceHistoryContainer}>
                            <FlatList
                                data={visibleCryptoDataPrice}
                                showsVerticalScrollIndicator={false}
                                renderItem={({item}) => (
                                    <View style={styles.priceHistoryBlock}>
                                        <View style={styles.priceHistoryIconContainer}>
                                            {
                                                item.priceNumber.startsWith('-') ?
                                                    (
                                                        <View style={styles.priceHistoryIconBlock}>
                                                            <FontAwesomeIcon style={styles.priceHistoryIconDown}
                                                                             icon={faArrowDown}/>
                                                        </View>
                                                    )
                                                    :
                                                    (
                                                        <View style={styles.priceHistoryIconBlock}>
                                                            <FontAwesomeIcon style={styles.priceHistoryIconUp}
                                                                             icon={faArrowUp}/>
                                                        </View>
                                                    )
                                            }
                                        </View>
                                        <View style={styles.priceHistoryDatePercentContainer}>
                                            <Text style={styles.priceHistoryPercentText}>{item.pricePercent}</Text>
                                            <Text style={styles.priceHistoryDateText}>{item.date}</Text>
                                        </View>
                                        <View style={styles.priceHistoryNumberContainer}>
                                            <Text
                                                style={item.priceNumber.startsWith('+') ? styles.priceHistoryNumberTextUp : styles.priceHistoryNumberTextDown}>
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
                                    <FontAwesomeIcon style={styles.cryptoArrowDownIcon} icon={faArrowDown}/>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
};

export default CryptoItemInfo;

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainWhite,
    },
    headerContainer: {
        width: Dimensions.get('screen').width,
        height: 200,
        backgroundColor: colors.mainDarkPurple
    },
    topHeaderContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
        marginTop: 40,
        marginLeft: 20,
    },
    headerIconBlock: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
        backgroundColor: colors.mainPurple,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    headerIconImage: {
        color: colors.mainWhite,
        width: 20,
        height: 20,
    },
    headerTextBlock: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",

    },
    headerNameCountText: {
        fontSize: 20,
        color: colors.mainWhite,
        fontWeight: "bold",
    },
    headerPricePercentText: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    headerUsdText: {
        fontSize: 14,
        color: colors.mainWhite,
        marginRight: 5
    },
    headerPriceText: {
        fontSize: 14,
        color: colors.mainWhite,
        fontWeight: "bold",
        marginRight: 10,
    },
    headerPercentText: {
        fontSize: 14,
        color: colors.mainWhite,
        fontWeight: "bold",
    },
    bottomHeaderContainer: {
        marginTop: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    headerBuySellButtonsBlock: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.mainPurple,
        marginLeft: 20,
        borderRadius: 100,
    },
    buyButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 100,
        borderRadius: 100,
        backgroundColor: colors.mainPurple,
    },
    sellButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 100,
        borderRadius: 100,
        backgroundColor: colors.mainPurple,
    },
    activeSellBuyButton: {
        backgroundColor: colors.mainWhite,
    },
    buySellButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.mainWhite
    },
    activeBuySellButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.mainBlack
    },
    headerDayButtonBlock: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 100,
        borderRadius: 100,
        backgroundColor: colors.mainPurple,
        marginRight: 20,
    },
    daySortingButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    sortMenuActiveText: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.mainWhite,
    },
    sortArrowIcon: {
        marginBottom: 3,
        width: 15,
        height: 15,
        color: colors.mainWhite,
        outlineStyle: 'none',
        marginLeft: 10,
    },
    sortDayMenuContainer: {

    },
    cryptoInfoChart: {
        marginVertical: 8,
        borderRadius: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.mainWhite,
        marginBottom: 20,
        // paddingRight: 0,
        paddingLeft: 0
    },


    cryptoArrowDownContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
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
    chartHeaderWrapper: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    chartHeaderCodes: {
        marginLeft: 20,
    },
    chartHeaderCodeText: {
        fontSize: 14,
        fontWeight: "bold"
    },
    chartHeaderWrapperPriceContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    chartHeaderWrapperPriceBlock: {
        marginRight: 10
    },
    chartHeaderCodesText: {
        fontSize: 14,
        fontWeight: "bold"
    },
    chartHeaderPriceText: {
        marginRight: 20
    },
    redPriceChart: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.mainRed
    },
    greenPriceChart: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.mainGreen
    },

    priceHistoryWrapper: {
        width: Dimensions.get('screen').width,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30,
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
