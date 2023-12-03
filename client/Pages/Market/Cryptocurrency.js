import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moc_btc from './moc_ltc_v1.json'
import { LineChart, BarChart } from 'react-native-chart-kit';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faArrowDown,
    faArrowUp, faCalendar, faChartLine,
    faMagnifyingGlassDollar, faMinus,
    faMoneyBill,
    faPlus,
    faShop
} from "@fortawesome/free-solid-svg-icons";
import {colors, extractChangePercent, processCurrencyDataForText} from "../../constants/helpers";
import LoadingScreen from "../Loading";
import Slider from '@react-native-community/slider';
import { Table, Row, Rows } from 'react-native-table-component';

const Cryptocurrency = ({navigation, route}) => {
    const { currencyData } = route.params;
    const itemsPerPage = 4;
    const [activeChartTab, setActiveChartTab] = useState('Price')
    const [priceDataValues, setPriceDataValues] = useState([])
    const [visibleCryptoDataPrice, setVisibleCryptoDataPrice] = useState([])
    const [loading, setLoading] = useState(true);
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [sliderValue, setSliderValue] = useState(20);
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);
    const [forecastTableHead, setForecastTableHead] = useState(['Name', 'Efficiency', 'Using', 'Usage %', 'Result']);
    const [forecastTableData, setForecastTableData] = useState(
        [
            ['ARIMA', '98%', '+', '100%', '+'],
            ['LSTM', '95%', '+', '100%', '+'],
            ['RF', '98%', '+', '100%', '+'],
            ['GB', '98%', '+', '100%', '+'],
            ['NN', '96%', '+', '100%', '+'],
            ['STK', '99%', '-', '-', '-'],
        ]
    );

    const [risksTableHead, setRisksTableHead] = useState(['Name', 'Result']);
    const [risksTableData, setRisksTableData] = useState(
        [
            ['VaR', '-0.041243393285825415'],
            ['ES', '0.0024771760765162766'],
        ]
    );

    const [risksSummaryTableHead, setRisksSummaryTableHead] = useState(['VaR', 'ES']);
    const [risksSummaryTableData, setRisksSummaryTableData] = useState(
        [
            ['', ''],
            ['', ''],
        ]
    );


    const responseFromSR = {
        VaR: -0.041243393285825415,
        ES: 0.0024771760765162766
    };

    function calculateRiskPercentages(responseData) {
        const varPercent = Math.abs(responseData.VaR * 100).toFixed(2);
        const esPercent = Math.abs(responseData.ES * 100).toFixed(2);

        const varThreshold = 5; // Поріг для VaR, наприклад 5%
        const esThreshold = 3; // Поріг для ES, наприклад 3%

        const isVarAcceptable = varPercent < varThreshold;
        const isEsAcceptable = esPercent < esThreshold;

        const varStatus = isVarAcceptable ? 'OK' : 'RISK';
        const esStatus = isEsAcceptable ? 'OK' : 'RISK';

        const varMessage = `VaR: With a probability of 98%, the maximum loss will not exceed ${varPercent}% of the investment.`;
        const esMessage = `ES: In the event that losses exceed VaR, the average size of losses can be close to ${esPercent}%.`;

        setRisksSummaryTableData([
            [varStatus, varMessage],
            [esStatus, esMessage]
        ])
    }

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    const cutChartData = useMemo(() =>
            moc_btc.response.historical_data.slice(-sliderValue),
        [moc_btc.response.historical_data, sliderValue]
    );

    const aggregatedPriceData = useMemo(() => {
        return cutChartData.reduce((acc, item, index) => {
            const chunkIndex = Math.floor(index / 5);
            if (!acc[chunkIndex]) {
                acc[chunkIndex] = { ...item, count: 1 };
            } else {
                acc[chunkIndex].price_close += item.price_close;
                acc[chunkIndex].count += 1;
            }
            return acc;
        }, []).map(item => item.price_close / item.count);
    }, [cutChartData]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
            calculateRiskPercentages(responseFromSR)
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        // Функція, яка буде викликана через 1000 мс
        const updatePriceData = () => {
            const processedData = processCurrencyDataForText(cutChartData.map(item => ({
                date: item.date,
                shadowH: item.price_high,
                shadowL: item.price_low,
                open: item.price_open,
                close: item.price_close,
            }))).reverse();
            processedData.pop();
            setPriceDataValues(processedData);
        };

        const timerId = setTimeout(updatePriceData, 1000);
        return () => clearTimeout(timerId);
    }, [cutChartData]);


    useEffect(() => {
        setVisibleCryptoDataPrice(priceDataValues.slice(0, visibleItems));
    }, [visibleItems, priceDataValues]);

    const handleNavigateBack = () => {
        navigation.navigate('Market');
    }

    // Графік Цін
    const priceData = cutChartData.map(item => ({
        date: item.date,
        shadowH: item.price_high,
        shadowL: item.price_low,
        open: item.price_open,
        close: item.price_close,
    }));


    // Графік Обсягу Торгів:
    const volumeData = cutChartData.map(item => item.volume_traded);


    // Прогнозний Графік:
    const futurePriceData = {
        historical: aggregatedPriceData,
        forecast: moc_btc.response.forecast.slice(-30).reverse(),
    };

    // Графік Ризиків:
    const risksData = cutChartData.map(item => item.risk);


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
                r: '1',
                strokeWidth: '1',
                stroke: '#293474'
            },
        };

        switch (activeTab) {
            case 'Price':
                return (
                    <LineChart
                        data={{
                            labels: [],
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
                );

            case 'Volume':
                return (
                    <LineChart
                        data={{
                            labels: [],
                            datasets: [{
                                data: volumeData,
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
                );

            case 'Future price':
                return (
                    <LineChart
                        data={{
                            labels: [],
                            datasets: [{
                                data: futurePriceData.historical.concat(futurePriceData.forecast),
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
                );

            case 'Risks':
                return (
                    <LineChart
                        strokeWidth={1.5}
                        data={{
                            labels: [],
                            datasets: [{
                                data: risksData,
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
                );

            default:
                return null;
        }
    }

    const MiniInfoCard = ({ timeDay, price, title, img, cardColor, txtColor, shadowColor}) => {
        return (
            <View style={[styles.miniCardContainer, {backgroundColor: cardColor}]}>
                <View style={styles.miniCardContent}>
                    <View style={styles.miniCardHeaderContainer}>
                        <View style={styles.miniCardCodeTextContainer}>
                            <Text style={[styles.miniCardCodeText, {color: txtColor}]}>{`${currencyData.code}`}</Text>
                        </View>
                    </View>

                    <View style={styles.miniCardFooterContainer}>
                        <View style={styles.miniCardFooterBlock}>
                            <View style={styles.miniCardFooterBlockTextContainer}>
                                <Text style={[styles.portfolioText, {color: shadowColor}]}>{`${timeDay}`}</Text>
                            </View>
                            <View style={styles.miniCardFooterBlockTextContainer}>
                                <Text style={[styles.priceText, {color: txtColor}]}>{price}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const SliderComponent = () => {
        const handleValueChange = (value) => {
            setSliderValue(value);
        };
        return (
            <View style={styles.sliderWrapper}>
                <Slider
                    style={styles.sliderContainer}
                    minimumValue={15}
                    maximumValue={60}
                    minimumTrackTintColor={colors.mainDarkPurple}
                    maximumTrackTintColor={colors.mainPurple}
                    thumbTintColor={colors.mainDarkPurple}
                    value={sliderValue}
                    onSlidingComplete={handleValueChange}
                />
            </View>
        );
    };

    if (loading) {
        return <LoadingScreen />;
    } else {
        return (
            <ScrollView scrollEnabled={isScrollEnabled} style={{ flex: 1 }}>
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

                    <View style={styles.cryptoIconsButtonWrapper}>
                        <TouchableOpacity>
                            <View style={styles.cryptoIconsButtonBlock}>
                                <FontAwesomeIcon style={styles.cryptoIconsButtonPlus} icon={faPlus} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.cryptoIconsButtonBlock}>
                                <FontAwesomeIcon style={styles.cryptoIconsButtonMinus} icon={faMinus} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.cryptoIconsButtonBlock}>
                                <FontAwesomeIcon style={styles.cryptoIconsButtonCalendar} icon={faCalendar} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.cryptoIconsButtonBlock}>
                                <FontAwesomeIcon style={styles.cryptoIconsButtonLine} icon={faChartLine} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateRangeTextContainer}>
                        {/*<Text style={styles.dateRangeText}>Date range</Text>*/}
                        <SliderComponent />
                    </View>

                    <View style={styles.cryptoStatsCardsContainer}>
                        <MiniInfoCard
                            timeDay={'Monthly'}
                            price={'$13,394'}
                            title={'Investment'}
                            cardColor={colors.mainWhite}
                            txtColor={colors.mainBlack}
                            shadowColor={colors.mainGray}
                        />
                        <MiniInfoCard
                            timeDay={'Daily'}
                            price={'$2,746'}
                            title={'Count'}
                            cardColor={colors.mainPurple}
                            txtColor={colors.mainWhite}
                            shadowColor={colors.mainWhite}
                        />
                    </View>

                    <View style={styles.forecastDetailsTextBlock}>
                        <Text style={styles.forecastDetailsText}>Forecast details</Text>
                    </View>

                    <View style={styles.cryptoForecastInfoContainer}>
                        <View style={styles.forecastTableContainer}>
                            <Table borderStyle={{borderWidth: 2, borderColor: colors.mainDarkPurple}}>
                                <Row data={forecastTableHead} style={styles.forecastTableHead} textStyle={styles.forecastTableHeadText}/>
                                <Rows data={forecastTableData} textStyle={styles.forecastTableText}/>
                            </Table>
                        </View>
                    </View>

                    <View style={styles.riskDetailsTextBlock}>
                        <Text style={styles.riskDetailsText}>Risks details</Text>
                    </View>

                    <View style={styles.cryptoForecastInfoContainer}>
                        <View style={styles.forecastTableContainer}>
                            <Table borderStyle={{borderWidth: 2, borderColor: colors.mainDarkPurple}}>
                                <Row data={risksTableHead} style={styles.forecastTableHead} textStyle={styles.forecastTableHeadText}/>
                                <Rows data={risksTableData} textStyle={styles.forecastTableText}/>
                            </Table>
                        </View>
                    </View>

                    <View style={styles.riskDetailsTextBlock}>
                        <Text style={styles.riskDetailsText}>Summary</Text>
                    </View>

                    <View style={styles.cryptoForecastInfoContainer}>
                        <View style={styles.forecastTableContainer}>
                            <Table borderStyle={{borderWidth: 2, borderColor: colors.mainDarkPurple}}>
                                <Row data={risksSummaryTableHead} style={styles.forecastTableHead} textStyle={styles.forecastTableHeadText}/>
                                <Rows data={risksSummaryTableData} textStyle={styles.forecastTableText}/>
                            </Table>
                        </View>
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
        marginBottom: 40,
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
        backgroundColor: colors.mainWhite,
        marginBottom: 20,
        // paddingRight: 0,
        paddingLeft: 0
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

    cryptoIconsButtonWrapper: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        marginTop: -10
    },
    cryptoIconsButtonBlock: {
        width: 40,
        height: 40,
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
        backgroundColor: colors.mainPurple,
        color: colors.mainWhite,
        opacity: 0.9
    },
    cryptoIconsButtonPlus: {
        color: colors.mainWhite,
        outlineStyle: 'none'
    },
    cryptoIconsButtonMinus: {
        color: colors.mainWhite,
        outlineStyle: 'none'
    },
    cryptoIconsButtonCalendar: {
        color: colors.mainWhite,
        outlineStyle: 'none'
    },
    cryptoIconsButtonLine: {
        color: colors.mainWhite,
        outlineStyle: 'none'
    },

    cryptoStatsCardsContainer: {
        width: '100%',
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: 'center',
        flexDirection: "row",
    },
    miniCardContainer: {
        height: 135,
        width: 135,
        padding: 20,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: colors.mainBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative'
    },
    miniCardContent: {

    },
    miniCardImageContainer: {
        borderRadius: 100,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    miniCardHeaderContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    miniCardImage: {
        width: 35,
        height: 35
    },
    miniCardCodeTextContainer: {
        // marginLeft: 10,
        height: 35,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    miniCardCodeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    miniCardFooterContainer: {
        marginTop: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    miniCardFooterBlock: {

    },
    miniCardFooterBlockTextContainer: {

    },
    portfolioText: {
        fontSize: 14,
    },
    priceText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    miniCardFooterArrowTextBlockGreen: {
        textAlign: "center",
        minWidth: 50,
        height: 20,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 20,
        display: "flex",
        borderRadius: 5,
        flexDirection: "row",
        backgroundColor: colors.mainGreen
    },
    miniCardFooterArrowTextBlockRed: {
        textAlign: "center",
        minWidth: 50,
        height: 20,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 20,
        display: "flex",
        borderRadius: 5,
        flexDirection: "row",
        backgroundColor: colors.mainRed
    },
    miniCardFooterBlockText: {
        textAlign: "center",
        width: '100%',
        fontSize: 14,
        color: colors.mainWhite
    },
    sliderWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    sliderContainer: {
        width: '100%',
        height: 40,
    },
    dateRangeTextContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    dateRangeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.mainDarkPurple,
        textAlign: "center",
    },

    forecastDetailsTextBlock: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    forecastDetailsText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.mainDarkPurple,
        textAlign: "center",
    },
    cryptoForecastInfoContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    forecastTableContainer: {

    },
    forecastTableHead: {
        height: 40,
        backgroundColor: colors.mainPurple,
        color: colors.mainWhite,
        textAlign: "center",
    },
    forecastTableHeadText: {
        color: colors.mainWhite,
        textAlign: "center",
        fontWeight: "bold",
    },
    forecastTableText: {
        margin: 6,
        textAlign: "center",
        color: colors.mainBlack,
    },

    riskDetailsTextBlock: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    riskDetailsText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.mainDarkPurple,
        textAlign: "center",
    },

    cryptoRiskVaRInfoContainer: {

    },

    cryptoRiskESInfoContainer: {

    }
})
