import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions} from "react-native";
import {colors, cryptoDataValues, extractChangePercent} from "../../constants/helpers";
import {faArrowDown, faArrowUp, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import moc_btc_v1 from "../Market/moc_btc_v1.json";
import CryptoItemInfo from "../Market/CryptoItemInfo";
import {fetchAllUserCrypto} from "../../store/cryptoStore";
import {Context} from "../../App";
import {check} from "../../http/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { observer } from "mobx-react";
import { useIsFocused } from '@react-navigation/native';


const Portfolio = observer(({navigation}) => {
    const itemsPerPage = 2;
    const [cardCountData, setCardCountData] = useState({price: '', change: ''});
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [cryptoDataPortfolio, setCryptoDataPortfolio] = useState([]);
    const {user} = useContext(Context)
    const {userCrypto} = useContext(Context)
    const isFocused = useIsFocused();

    const checkToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null || undefined) {
                return jwtDecode(value)
            }
        } catch (e) {
            console.log('err checkToken', e)
        }
    }

    const calculateTotalPriceAndAbsoluteChange = (data) => {
        let totalPrice = 0;
        let totalChange = 0;
        if (data && data.length > 0) {
            data.forEach(item => {
                const price = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
                const changeMatch = item.change.match(/[+-]?\$([0-9.,]+)/);
                const absoluteChange = changeMatch ? parseFloat(changeMatch[1].replace(/,/g, "")) : 0;
                if (item.change.includes('-')) {
                    totalChange -= absoluteChange;
                } else {
                    totalChange += absoluteChange;
                }
                totalPrice += price;
            });
            setCardCountData({
                price: totalPrice.toFixed(2),
                // change: `${totalChange >= 0 ? '+' : ''}$${totalChange.toFixed(2)}`
                change: totalChange.toFixed(2)
            })
        } else {
            return setCardCountData({price: '', change: ''})
        }
    }

    const loadData = async (userId) => {
        try {
            let fullUserData = []
            const dataFromServer = await fetchAllUserCrypto(userId);
            dataFromServer.map(userCrypto => {
                const cryptoData = cryptoDataValues.find(crypto => crypto.code === userCrypto.cryptocurrency.code);
                if (cryptoData) {
                    fullUserData.push(cryptoData)
                }
            });

            calculateTotalPriceAndAbsoluteChange(fullUserData)
            setCryptoDataPortfolio(fullUserData)
            userCrypto.setUserCrypto(fullUserData)
        } catch (error) {
            console.error("Error when fetchAllCrypto:", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            checkToken().then((res) => {
                if (res && res.id) {
                    loadData(res.id);
                }
            });
        }
    }, [isFocused]);

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + itemsPerPage);
    };

    const removeDuplicatesByName = array => Array.from(new Map(array.map(item => [item.name, item])).values());

    const getPortfolioData = () => {
        return cryptoDataPortfolio;
    }

    const getTopTraded = () => {
        let cloneData = JSON.parse(JSON.stringify(cryptoDataValues))
        let data = cloneData.sort((a, b) => extractChangePercent(b.change) - extractChangePercent(a.change));
        return removeDuplicatesByName(data.slice(1, 15));
    }

    const handleNavigateToCryptocurrency = (item) => {
        navigation.navigate('Cryptocurrency', {
            currencyData: item
        });
    }
    const handleNavigateToCryptoItemInfo = (item) => {
        navigation.navigate('CryptoItemInfo', {
            currencyData: item
        });
    }
    const MiniPortfolioCard = ({ idx, code, price, change, img, fullItemData}) => {
        return (
            <TouchableOpacity onPress={() => handleNavigateToCryptocurrency(fullItemData)} key={idx}>
                <View style={styles.miniCardContainer}>
                    <View style={styles.miniCardContent}>
                        <View style={styles.miniCardHeaderContainer}>
                            <View style={styles.miniCardImageContainer}>
                                <Image style={styles.miniCardImage} source={{ uri: img }} />
                            </View>
                            <View style={styles.miniCardCodeTextContainer}>
                                <Text style={styles.miniCardCodeText}>{code}</Text>
                            </View>
                        </View>

                        <View style={styles.miniCardFooterContainer}>
                            <View style={styles.miniCardFooterBlock}>
                                <View style={styles.miniCardFooterBlockTextContainer}>
                                    <Text style={styles.portfolioText}>Portfolio</Text>
                                </View>
                                <View style={styles.miniCardFooterBlockTextContainer}>
                                    <Text style={styles.priceText}>{price}</Text>
                                </View>
                            </View>

                            <View style={change.startsWith('-') ? styles.miniCardFooterArrowTextBlockRed : styles.miniCardFooterArrowTextBlockGreen}>
                                <Text style={styles.miniCardFooterBlockText}>
                                    {change.startsWith('-') ? `- ${extractChangePercent(change)}` : `+ ${extractChangePercent(change)}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <View style={styles.headerUserContainer}>
                    <View style={styles.headerTextContainer}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome</Text>
                        </View>
                        <View>
                            <Text style={styles.userNameText}>Vladyslav Kondratskyi</Text>
                        </View>
                    </View>
                    <View>
                        <View style={styles.headerUserImageContainer}>
                            <View style={styles.customFade}>
                                <Svg height="100%" width="100%" style={[StyleSheet.absoluteFill, {borderRadius: 10}]}>
                                    <Defs>
                                        <LinearGradient id="grad" x1="90%" y1="90%" x2="20%" y2="0%">
                                            <Stop offset="0%" stopColor={colors.mainPurple} stopOpacity="1" />
                                            <Stop offset="100%" stopColor={colors.mainDeepDark} stopOpacity="0" />
                                        </LinearGradient>
                                    </Defs>
                                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                                </Svg>
                            </View>
                            <Image style={styles.headerUserImage} source={require('../../assets/userImage.png')}/>
                        </View>
                    </View>
                </View>

                <View style={styles.balanceCardWrapper}>
                    <View style={styles.balanceCardContainer}>

                        <View style={styles.firstCircleBalanceCardShadowContainer}>
                            <View style={styles.firstCircleBalanceCardShadowBlock}></View>
                        </View>
                        <View style={styles.secondCircleBalanceCardShadowContainer}></View>

                        <View style={styles.customFade}>
                            <Svg height="100%" width="100%" style={[StyleSheet.absoluteFill, {borderRadius: 20}]}>
                                <Defs>
                                    <LinearGradient id="grad" x1="90%" y1="90%" x2="0%" y2="0%">
                                        <Stop offset="0%" stopColor={colors.mainDeepDark} stopOpacity="1" />
                                        <Stop offset="100%" stopColor={colors.mainPurple} stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
                            </Svg>
                        </View>

                        <View style={styles.topCardBalanceContainer}>
                            <View style={styles.topCardBalanceTextBlock}>
                                <Text style={styles.balanceText}>Balance</Text>
                            </View>
                            <View style={styles.topCardBalanceTextBlock}>
                                <Text style={styles.sumText}>{`$${cardCountData.price}`}</Text>
                            </View>
                        </View>

                        <View style={styles.bottomCardBalanceContainer}>
                            <View style={styles.bottomLeftCardBalanceContainer}>
                                <View style={styles.bottomLeftCardBalanceBlock}>
                                    <Text style={styles.monthlyProfitText}>Profit</Text>
                                </View>
                                <View style={styles.bottomLeftCardBalanceBlock}>
                                    <Text style={styles.monthlyPrice}>{`$${cardCountData.change}`}</Text>
                                </View>
                            </View>

                            {/*<View style={styles.miniCardFooterArrowTextBlockGreen}>*/}
                            {/*    <Text style={styles.miniCardFooterBlockText}>*/}
                            {/*        +27%*/}
                            {/*    </Text>*/}
                            {/*</View>*/}

                            {/*<View style={styles.bottomRightCardBalanceContainer}>*/}
                            {/*    <View style={styles.bottomRightCardBalanceBlock}>*/}
                            {/*        {*/}
                            {/*            !styles.container ?*/}
                            {/*                (*/}
                            {/*                    <FontAwesomeIcon style={styles.cardBalanceArrow} icon={faArrowDown} />*/}
                            {/*                )*/}
                            {/*                :*/}
                            {/*                (*/}
                            {/*                    <FontAwesomeIcon style={styles.cardBalanceArrow} icon={faArrowUp} />*/}
                            {/*                )*/}
                            {/*        }*/}
                            {/*    </View>*/}
                            {/*    <View style={styles.bottomRightCardBalanceBlock}>*/}
                            {/*        <Text style={styles.bottomRightCardBalanceText}>+25%</Text>*/}
                            {/*    </View>*/}
                            {/*</View>*/}
                        </View>

                    </View>
                </View>

                <View style={styles.myPortfolioTextContainer}>
                    <Text style={styles.myPortfolioText}>My Portfolio</Text>
                </View>

                <View style={styles.myPortfolioCardsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{height: 135}}
                    >
                        <View style={styles.myPortfolioCardsContainer}>
                            {
                                getPortfolioData() && getPortfolioData().map((el, idx) => {
                                    return (
                                        <MiniPortfolioCard
                                            id={idx.toString() + el.name}
                                            idx={idx.toString() + el.name}
                                            name={el.name}
                                            code={el.code}
                                            price={el.price}
                                            change={el.change}
                                            img={el.img}
                                            fullItemData={el}
                                        />
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.myPortfolioTextContainer}>
                    <Text style={styles.myPortfolioText}>Ranking List</Text>
                </View>

                <View style={styles.flatListContainer}>
                    <FlatList
                        data={getTopTraded().slice(0, visibleItems)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleNavigateToCryptoItemInfo(item)}>
                                <View style={styles.listItem}>
                                    <View style={styles.icon}>
                                        <Image style={styles.iconImage} source={{ uri: item.img }} />
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

                <View>
                    {visibleItems < getTopTraded().length && (
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
});

export default Portfolio;

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainWhite,
    },
    headerUserContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerTextContainer: {
        marginLeft: 10,
    },
    welcomeText: {
        fontSize: 16,
        // fontWeight: "bold",
        color: colors.mainGray
    },
    userNameText: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.mainBlack,
    },
    headerUserImageContainer: {
        marginRight: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.mainPurple,
        borderRadius: 10,
        width: 50,
        height: 50,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    headerUserImage: {
        width: 40,
        height: 40
    },
    balanceCardWrapper: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden',
    },
    balanceCardContainer: {
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
        width: '90%',
        height: 170,
        borderRadius: 20,
        backgroundColor: colors.mainPurple,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
        overflow: 'hidden',
    },
    firstCircleBalanceCardShadowContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -20,
        right: -50,
        width: 130,
        height: 130,
        borderRadius: 100,
        backgroundColor: colors.mainColor,
        opacity: 0.4
    },
    firstCircleBalanceCardShadowBlock: {
        width: '55%',
        height: '55%',
        backgroundColor: colors.mainPurple,
        borderRadius: 100,
    },
    secondCircleBalanceCardShadowContainer: {
        position: "absolute",
        bottom: -60,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: colors.mainColor,
        opacity: 0.4
    },
    customFade: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    topCardBalanceContainer: {
        marginLeft: 20,
        marginTop: 20,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
    },
    topCardBalanceTextBlock: {

    },
    balanceText: {
        marginLeft: 3,
        fontSize: 14,
        color: colors.mainWhite
    },
    sumText: {
        fontSize: 28,
        color: colors.mainWhite,
        fontWeight: "bold",
    },
    bottomCardBalanceContainer: {
        width: '90%',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginLeft: 20,
        marginTop: 20,
    },
    bottomLeftCardBalanceContainer: {

    },
    bottomLeftCardBalanceBlock: {

    },
    monthlyProfitText: {
        marginLeft: 2,
        fontSize: 14,
        color: colors.mainWhite
    },
    monthlyPrice: {
        marginLeft: 3,
        fontSize: 18,
        color: colors.mainWhite,
        fontWeight: "bold",
    },
    bottomRightCardBalanceContainer: {
        marginTop: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.mainDarkGreen,
        paddingRight: 5,
        paddingLeft: 5,
        borderRadius: 10
    },
    bottomRightCardBalanceBlock: {

    },
    cardBalanceArrow: {
        marginRight: 5,
        width: 12,
        height: 12,
        color: colors.mainBlue,
    },
    bottomRightCardBalanceText: {
        fontSize: 18,
        color: colors.mainWhite,
        fontWeight: "bold",
    },
    myPortfolioTextContainer: {
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    myPortfolioText: {
        fontSize: 20,
        color: colors.mainBlack,
        fontWeight: '600',
    },


    // My portfolio
    myPortfolioCardsWrapper: {
        height: 160,
    },
    myPortfolioCardsContainer: {
        // marginTop: 10,
        flexDirection: 'row',
        // justifyContent: 'space-around',
    },
    miniCardContainer: {
        height: 130,
        width: 200,
        backgroundColor: colors.mainWhite,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
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
        marginLeft: 10,
        height: 35,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    miniCardCodeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.mainBlack
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
        color: colors.mainGray
    },
    priceText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.mainBlack
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
    miniCardFooterBlockIconContainer: {

    },
    miniCardFooterRedIcon: {
        marginTop: 4,
        marginRight: 5,
        width: 12,
        height: 12,
        color: colors.mainRed,
    },
    miniCardFooterGreenIcon: {
        marginTop: 4,
        marginRight: 5,
        width: 12,
        height: 12,
        color: colors.mainGreen,
    },
    miniCardFooterBlockText: {
        textAlign: "center",
        width: '100%',
        fontSize: 14,
        color: colors.mainWhite
    },

    // Ranking list
    flatListContainer: {
        // width: Dimensions.get('screen').width - 40,
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
});
