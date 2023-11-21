import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from "react-native";
import {colors, cryptoDataValues} from "../../constants/helpers";
import {faArrowDown, faArrowUp, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Svg, {Defs, LinearGradient, Path, Rect, Stop} from "react-native-svg";
import moc_btc_v1 from "../Market/moc_btc_v1.json";

const Portfolio = () => {
    const removeDuplicatesByName = array => Array.from(new Map(array.map(item => [item.name, item])).values());
    let filteredData = cryptoDataValues.sort((a, b) => parseFloat(b.price.replace('$', '').replace(',', '')) - parseFloat(a.price.replace('$', '').replace(',', '')));
    let first15 = removeDuplicatesByName(filteredData).slice(2, 15);

    const extractChangePercent = changeString => {
        const matches = changeString.match(/\(([^)]+)\)/);
        return matches ? parseFloat(matches[1].replace('%', '')) : 0;
    };

    const MiniPortfolioCard = ({ name, code, price, change, img,}) => {
        return (
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

                        <View style={styles.miniCardFooterArrowTextBlock}>
                            <View style={styles.miniCardFooterBlockIconContainer}>
                                {
                                    change.startsWith('-') ?
                                        (
                                            <View>
                                                <FontAwesomeIcon style={styles.miniCardFooterRedIcon} icon={faArrowDown} />
                                            </View>
                                        )
                                        :
                                        (
                                            <View>
                                                <FontAwesomeIcon style={styles.miniCardFooterGreenIcon} icon={faArrowUp} />
                                            </View>
                                        )
                                }
                            </View>
                            <View style={{height: 15}}>
                                <Text style={styles.miniCardFooterBlockText}>
                                    {change.startsWith('-') ? `-${extractChangePercent(change)}` : `+${extractChangePercent(change)}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerUserContainer}>
                <View style={styles.headerTextContainer}>
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.welcomeText}>Welcome</Text>
                    </View>
                    <View style={styles.headerTextBlock}>
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
                            <Text style={styles.sumText}>$ 375,854</Text>
                        </View>
                    </View>

                    <View style={styles.bottomCardBalanceContainer}>
                        <View style={styles.bottomLeftCardBalanceContainer}>
                            <View style={styles.bottomLeftCardBalanceBlock}>
                                <Text style={styles.monthlyProfitText}>Monthly profit</Text>
                            </View>
                            <View style={styles.bottomLeftCardBalanceBlock}>
                                <Text style={styles.monthlyPrice}>$ 8,579</Text>
                            </View>
                        </View>

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
                            first15.map((el, idx) => {
                                return (
                                    <MiniPortfolioCard
                                        name={el.name}
                                        code={el.code}
                                        price={el.price}
                                        change={el.change}
                                        img={el.img}
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

            <View>

            </View>
        </View>
    );
};

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
    headerTextBlock: {

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
        marginTop: 30,
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
    miniCardFooterArrowTextBlock: {
        height: 20,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 20,
        display: "flex",
        borderRadius: 5,
        flexDirection: "row",
        backgroundColor: colors.mainDeepDark
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
        fontSize: 14,
        color: colors.mainWhite
    },
});
