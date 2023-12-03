import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowDown, faBars, faCircleUser, faPlus} from "@fortawesome/free-solid-svg-icons";
import {colors, cryptoDataValues} from "../../constants/helpers";
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const Market = ({navigation}) => {
    const removeDuplicatesByName = array => Array.from(new Map(array.map(item => [item.name, item])).values());
    const [cryptoData, setCryptoData] = useState(removeDuplicatesByName(cryptoDataValues));

    const itemsPerPage = 5;
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredAndSortedData, setFilteredAndSortedData] = useState([]);
    const [marketMenuVisible, setMarketMenuVisible] = useState(false);

    const clearStorageToken = async () => {
        if (!marketMenuVisible) {
            try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('isAuthenticated');
            } catch (e) {
                console.error('Failed to get token from AsyncStorage', e);
            }
        } else {
            handleCloseMarketMenu()
        }
    };

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    const handleClickMarketMenu = () => {
        setMarketMenuVisible(!marketMenuVisible)
    }

    const handleCloseMarketMenu = () => {
        setMarketMenuVisible(false)
    }

    const handleClickPlusIcon = (name) => {
        if (!marketMenuVisible) {
            console.log(name)
        } else {
            handleCloseMarketMenu()
        }
    }

    const handleNavigateToCryptocurrency = (item) => {
        if (!marketMenuVisible) {
            navigation.navigate('CryptoItemInfo', {
                currencyData: item
            });
        } else {
            handleCloseMarketMenu()
        }
    }

    const changeCategory = category => {
        setCryptoData(removeDuplicatesByName(cryptoDataValues))
        setFilteredAndSortedData([]);
        setSelectedCategory(category);
        setVisibleItems(itemsPerPage);
        handleCloseMarketMenu()
    };

    useEffect(() => {
        let data = [];
        if (selectedCategory === 'All' || selectedCategory === 'Purchased') {
            data = cryptoData;
        } else {
            let filteredData = cryptoData;

            const extractChangePercent = changeString => {
                const matches = changeString.match(/\(([^)]+)\)/);
                return matches ? parseFloat(matches[1].replace('%', '')) : 0;
            };

            switch (selectedCategory) {
                case 'Top movers':
                    filteredData = filteredData.sort((a, b) => extractChangePercent(b.change) - extractChangePercent(a.change));
                    data = filteredData.slice(0, 15);
                    break;
                case 'Top traded':
                    filteredData = filteredData.sort((a, b) => parseFloat(b.price.replace('$', '').replace(',', '')) - parseFloat(a.price.replace('$', '').replace(',', '')));
                    data = filteredData.slice(0, 15);
                    break;
                case 'The best now':
                    data = filteredData.filter(item => extractChangePercent(item.change) > 0);
                    break;
                case 'Recommended':
                    filteredData = filteredData.filter(item => extractChangePercent(item.change) > 0);
                    filteredData = filteredData.sort((a, b) => parseFloat(a.price.replace('$', '').replace(',', '')) - parseFloat(b.price.replace('$', '').replace(',', '')));
                    data = filteredData;
                    break;
                case 'The worst':
                    data = filteredData.filter(item => extractChangePercent(item.change) < 0);
                    break;
            }
        }

        setFilteredAndSortedData(data.slice(0, visibleItems));
    }, [selectedCategory, visibleItems, cryptoData]);

    const litecoinPrices = [176.5, 178.2, 179.3, 180.5, 179.0, 181.0, 183.7];
    const ripplePrices = [176, 178, 173, 174, 176, 177, 175];

    const CryptoCard = ({ name, price, data }) => {
        const svgHeight = 40; // Висота SVG
        const svgWidth = 120;  // Ширина SVG

        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);

        const normalizeY = (value) => {
            return svgHeight - ((value - minValue) / (maxValue - minValue)) * svgHeight;
        };

        const buildPath = (dataPoints) => {
            if (dataPoints.length === 0) {
                return '';
            }

            let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;

            for (let i = 1; i < dataPoints.length; i++) {
                const { x: prevX, y: prevY } = dataPoints[i - 1];
                const { x, y } = dataPoints[i];
                const midX = (prevX + x) / 2;
                path += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
            }

            return path;
        };

        const dataPoints = data.map((value, index) => ({
            x: (index / (data.length - 1)) * svgWidth,
            y: normalizeY(value),
        }));
        const path = buildPath(dataPoints);

        const gradientId = 'fadeGradient';
        const fadePath = `${path} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

        return (
            <View style={styles.smallCardContainer}>
                <View style={styles.smallCardChartWrapper}>
                    <Svg height={svgHeight} width={svgWidth}>
                        <Defs>
                            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100%">
                                <Stop offset="0%" stopColor="#5d78e9" stopOpacity="0.4" />
                                <Stop offset="100%" stopColor="#5d78e9" stopOpacity="0" />
                            </LinearGradient>
                        </Defs>
                        <Path d={fadePath} fill={`url(#${gradientId})`} />
                        <Path d={path} fill="none" stroke="#5d78e9" strokeWidth="2" />
                    </Svg>
                </View>
                <View style={styles.smallCardContent}>
                    <View style={styles.smallCardCurrencyNameBlock}>
                        <View>
                            <Text style={styles.smallCardCurrencyName}>{name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleClickPlusIcon(name)}>
                            <View style={styles.smallCardPlusIconBlock}>
                                <FontAwesomeIcon style={styles.smallCardPlusIcon} icon={faPlus} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.smallCardPriceBlock}>
                        <Text style={styles.smallCardPrice}>{price}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const MarketMenu = () => {
        if (marketMenuVisible) {
            return (
                <View style={styles.marketMenuContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.menuTabsContainer}
                    >
                        <View style={styles.marketMenuHeaderContainer}>
                            <Text style={styles.marketMenuHeaderText}>Filter options</Text>
                        </View>
                        <View style={{marginBottom: 15}}>
                            <TouchableOpacity onPress={() => changeCategory('All')}>
                                <Text style={[styles.tab, selectedCategory === 'All' && styles.selectedTab]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('Top movers')}>
                                <Text style={[styles.tab, selectedCategory === 'Top movers' && styles.selectedTab]}>Top movers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('Top traded')}>
                                <Text style={[styles.tab, selectedCategory === 'Top traded' && styles.selectedTab]}>Top traded</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('Purchased')}>
                                <Text style={[styles.tab, selectedCategory === 'Purchased' && styles.selectedTab]}>Purchased</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('The best now')}>
                                <Text style={[styles.tab, selectedCategory === 'The best now' && styles.selectedTab]}>The best now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('Recommended')}>
                                <Text style={[styles.tab, selectedCategory === 'Recommended' && styles.selectedTab]}>Recommended</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeCategory('The worst')}>
                                <Text style={[styles.tab, selectedCategory === 'The worst' && styles.selectedTab]}>The worst</Text>
                            </TouchableOpacity>
                        </View>
                        <View>

                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            return null
        }
    }

    return (
        <>
            <MarketMenu />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollViewContainer}
            >
                <TouchableWithoutFeedback onPress={handleCloseMarketMenu}>
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <View>
                                <TouchableOpacity onPress={handleClickMarketMenu} style={styles.headerIconContainer}>
                                    <FontAwesomeIcon style={styles.headerMenuIcon} icon={faBars} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.title}>
                                    Market
                                </Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={clearStorageToken} style={styles.headerIconContainer}>
                                    <FontAwesomeIcon style={styles.headerUserIcon} icon={faCircleUser} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={filteredAndSortedData}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleNavigateToCryptocurrency(item)}>
                                        <View style={styles.listItem}>
                                            <View style={[styles.icon]}>
                                                {
                                                    item.img ?
                                                    (<Image style={styles.iconImage} source={{ uri: item.img }} />)
                                                    : (<View style={[styles.icon, {backgroundColor: item.color}]}></View>)
                                                }
                                            </View>
                                            <View style={styles.listItemDetails}>
                                                <Text style={styles.listItemName}>{item.name}</Text>
                                                <Text style={styles.listItemCode}>{item.code}</Text>
                                            </View>
                                            <View style={styles.listItemPriceDetails}>
                                                <Text style={styles.listItemPrice}>{item.price}</Text>
                                                <Text style={[styles.listItemChange, item.change.startsWith('-') ? { color: `${colors.mainRed}` } : { color: `${colors.mainDarkGreen}` }]}>{item.change}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.code}
                            />
                        </View>
                        <View style={styles.smallCardsWrapper}>
                            <CryptoCard name="Litecoin" price="$183.7" data={litecoinPrices} />
                            <CryptoCard name="Ripple" price="$0.8022" data={ripplePrices} />
                        </View>
                        {visibleItems < cryptoData.length && (
                            <View style={styles.cryptoArrowDownContainer}>
                                <TouchableOpacity style={styles.cryptoArrowDownBlock} onPress={loadMore}>
                                    <FontAwesomeIcon style={styles.cryptoArrowDownIcon} icon={faArrowDown} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </>
    );
};

const styles= StyleSheet.create({
    scrollViewContainer: {
        position: "relative",
    },
    marketMenuContainer: {
        borderRadius: 8,
        backgroundColor: colors.mainPurple,
        width: '50%',
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 2,
        opacity: 0.9
    },
    menuTabsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    marketMenuHeaderContainer: {
        marginTop: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
    },
    marketMenuHeaderText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: colors.mainWhite,
        marginBottom: 10
    },
    tab: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        minWidth: 55,
        marginBottom: 5,
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
        backgroundColor: colors.mainDarkPurple,
        color: colors.mainWhite,
    },
    selectedTab: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        marginBottom: 5,
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
        backgroundColor: colors.mainDarkPurple,
        color: colors.mainWhite,
        opacity: 0.9
    },
    container: {
        zIndex: 1,
        flex: 1,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.mainWhite
    },
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
        flexDirection: "row",
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginRight: 15,
    },
    iconImage: {
        width: 30,
        height: 30,
        borderRadius: 50,
    },
    headerIconContainer: {
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
    headerMenuIcon: {
        outlineStyle: 'none'
    },
    headerUserIcon: {
        outlineStyle: 'none'
    },
    flatListContainer: {
        width: Dimensions.get('screen').width - 40,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        width: Dimensions.get('screen').width - 40,
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
    listItemDetails: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    listItemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listItemCode: {
        color: colors.mainDarkGray,
        marginTop: 5
    },
    chartWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listItemPriceDetails: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    listItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    listItemChange: {
        fontSize: 12,
        fontWeight: 'normal',
    },
    loadMoreButtonContainer: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    loadMoreButton: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: colors.mainBlack,
        width: 200
    },
    cryptoArrowDownContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
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
    smallCardsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    smallCardContainer: {
        height: 135,
        width: 135,
        backgroundColor: colors.mainWhite,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2, // for Android
        shadowColor: colors.mainBlack, // for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative'
    },
    smallCardChartWrapper: {
        display: "flex",
        justifyContent: "center",
        marginTop: 60,
        opacity: 0.6,
        width: 120,
        height: 40
    },
    smallCardContent: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    smallCardCurrencyNameBlock: {
        marginTop: 10,
        marginLeft: 10,
        width: 150,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    smallCardCurrencyName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    smallCardPlusIconBlock: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 28,
        height: 28,
        marginRight: 35,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        backgroundColor: colors.mainWhite,
        borderRadius: 50,
    },
    smallCardPlusIcon: {
        outlineStyle: 'none'
    },
    smallCardPriceBlock: {
        marginTop: 3,
        marginLeft: 10,
        width: 150,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    smallCardPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.mainDarkGreen
    },
});

export default Market;

