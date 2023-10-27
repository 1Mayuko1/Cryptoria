import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from "react-native";
import moc_btc_v1 from './moc_btc_v1.json'
import { LineChart, BarChart } from 'react-native-chart-kit';


const Cryptocurrency = ({navigation, route}) => {
    const { currencyData } = route.params;
    // const [apiForecastData, setApiForecastData] = useState([])
    const [activeChartTab, setActiveChartTab] = useState('Price')

    // Графік Цін (Candlestick):
    const priceData = moc_btc_v1.response.historical_data.map(item => ({
        date: new Date(),  // додайте відповідний час, якщо у вас є такі дані
        shadowH: item.price_high,
        shadowL: item.price_low,
        open: item.price_open,
        close: item.price_close,
    }));

    // Графік Обсягу Торгів:
    const volumeData = moc_btc_v1.response.historical_data.map(item => item.volume_traded);

    // Прогнозний Графік:
    const futurePriceData = {
        historical: moc_btc_v1.response.historical_data.map(item => item.price_close),
        forecast: moc_btc_v1.response.forecast,
    };

    // Графік Ризиків:
    const risksData = moc_btc_v1.response.historical_data.map(item => item.risk);


    const Chart = ({ activeTab }) => {
        const chartConfig = {
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f6f6f6',
            backgroundGradientTo: '#e0e0e0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
        };

        switch (activeTab) {
            case 'Price':
                return (
                    <BarChart
                        yAxisLabel={'$'}
                        yAxisInterval={1}
                        yAxisUseDecimal={false}
                        data={{
                            labels: [], // Add dates or other relevant labels here
                            datasets: [{
                                data: priceData.map(item => item.close),
                            }]
                        }}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                );

            case 'Volume':
                return (
                    <BarChart
                        yAxisLabel={'$'}
                        yAxisInterval={1}
                        yAxisUseDecimal={false}
                        data={{
                            labels: [],
                            datasets: [{
                                data: volumeData,
                            }]
                        }}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                );

            case 'Future price':
                return (
                    <LineChart
                        dotSize={2}
                        data={{
                            labels: [],
                            datasets: [{
                                data: futurePriceData.historical.concat(futurePriceData.forecast),
                            }]
                        }}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                );

            case 'Risks':
                return (
                    <LineChart
                        strokeWidth={1.5} // Increased line thickness
                        data={{
                            labels: [],
                            datasets: [{
                                data: risksData,
                            }]
                        }}
                        width={Dimensions.get('window').width - 16}
                        height={220}
                        chartConfig={chartConfig}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                );

            default:
                return null;
        }
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.cryptoPageTitle}>
                    {currencyData.name}
                </Text>

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
                    style={[styles.chartTab, activeChartTab === 'Risks' && styles.activeChartTab]}
                    onPress={() => setActiveChartTab('Risks')}
                >
                    Risks
                </Text>
            </View>

            <Chart activeTab={activeChartTab} />

        </View>
    );
};

export default Cryptocurrency;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    cryptoPageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
    chartTabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    chartTab: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 3,
        paddingTop: 3,
        borderRadius: 5,
        fontWeight: 600
    },
    activeChartTab: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 3,
        paddingTop: 3,
        borderRadius: 5,
        backgroundColor: '#000',
        color: '#fff'
    },
})
