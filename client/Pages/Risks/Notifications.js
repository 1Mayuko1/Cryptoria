import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../constants/helpers";
import {
    faAngleDown,
    faComment,
    faEnvelope,
    faExclamation,
    faInfo,
    faMessage,
    faShop, faTrash, faUser
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {getUserNotifications, deleteAllUserNotifications, deleteOneUserNotification} from "../../store/cryptoStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import {useIsFocused} from "@react-navigation/native";


const Notifications = ({navigation}) => {
    const isPageFocused = useIsFocused();
    const [expandedSections, setExpandedSections] = useState({});
    const [allNotyData, setAllNotyData] = useState([]);

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

    useEffect(() => {
        AsyncStorage.setItem('allowGetNoty', 'true');

        return () => {
            AsyncStorage.setItem('allowGetNoty', 'false');
        };
    }, []);

    useEffect(() => {
        const fetchDataForAllUserNoty = async () => {
            const allowGetNoty = await AsyncStorage.getItem('allowGetNoty');
            if (allowGetNoty === 'true' && isPageFocused) {
                checkToken().then((res) => {
                    const userId = res.id;
                    getUserNotifications(userId).then((res) => {
                        setAllNotyData(res.reverse())
                    }).catch((e) => {
                        console.log('error when getUserNotifications', e)
                    });
                });
            }
        };

        fetchDataForAllUserNoty();
        const interval = setInterval(fetchDataForAllUserNoty, 5000);

        return () => clearInterval(interval);
    }, [isPageFocused]);

    const displayStatusIcon = (status) => {
        if (status === 'info') {
            return (
                <View style={[styles.mainStatusIconContainer, {backgroundColor: colors.mainGreen}]}>
                    <FontAwesomeIcon style={styles.infoStatusIcon} icon={faInfo} />
                </View>
            )
        } else if (status === 'risk') {
            return (
                <View style={[styles.mainStatusIconContainer, {backgroundColor: colors.mainRed}]}>
                    <FontAwesomeIcon style={styles.riskStatusIcon} icon={faExclamation} />
                </View>
            )
        } else if (status === 'warning') {
            return (
                <View style={[styles.mainStatusIconContainer, {backgroundColor: colors.mainPurple}]}>
                    <FontAwesomeIcon style={styles.messageStatusIcon} icon={faComment} />
                </View>
            )
        } else {
            return (
                <View style={[styles.mainStatusIconContainer, {backgroundColor: colors.mainGreen}]}>
                    <FontAwesomeIcon style={styles.messageStatusIcon} icon={faComment} />
                </View>
            )
        }
    }


    const openNotySection = (elId) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [elId]: !prevState[elId]
        }));
    }

    const formatISODateToCustom = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        date.setHours(date.getHours());
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}, ${hours}:${minutes}`;
    }

    const parseAndFormatMessage = (message) => {
        const parts = message.split('\n');

        const formattedParts = parts.map(part => {
            if (part.startsWith('Використані моделі:')) {
                return `Моделі: ${part.split(': ')[1]}`;
            }

            if (part.startsWith('Ефективність моделей:')) {
                return;
            }

            return part;
        });

        return formattedParts.join('\n');
    }

    const handleDeleteNoty = () => {
        deleteAllUserNotifications().then((res) => {
            setAllNotyData([])
        });
    }

    const handleNavigateBack = () => {
        // navigation.navigate('Cryptocurrency')
        navigation.goBack()
    }

    const NotyComponent = () => {
        if (allNotyData && allNotyData.length > 0) {
            return allNotyData.map((noty, idx) => {
                const containerStyle = expandedSections[noty.id]
                    ? {...styles.notyContainerWrapper, height: 250}
                    : styles.notyContainerWrapper;

                return (
                    <View style={containerStyle}>
                        <View style={styles.notyHeaderMainContainer}>
                            <View style={styles.notyHeaderContainer}>
                                {/*<View style={styles.notyHeaderIconBlock}>*/}
                                {/*    <FontAwesomeIcon style={styles.notyHeaderIcon} icon={faEnvelope} />*/}
                                {/*</View>*/}
                                <View style={styles.notyHeaderTextBlock}>
                                    <Text style={styles.notyHeaderText}>
                                        {`Notification • ${formatISODateToCustom(noty.createdAt)}`}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.notyHeaderStatusIcon}>
                                {displayStatusIcon(noty.type)}
                            </View>
                        </View>
                        { expandedSections[noty.id] ?
                            <View style={styles.notyBodyTextContainer}>
                                <View style={styles.notyBodyTextBlock}>
                                    <Text style={styles.notyBodyMessageText}>
                                        {`${parseAndFormatMessage(noty.message)}`}
                                    </Text>
                                </View>
                            </View> : null
                        }
                        <View style={styles.footerDetailsContainer}>
                            <TouchableOpacity onPress={() => openNotySection(noty.id)}>
                                <View style={styles.footerDetailsIconBlock}>
                                    <FontAwesomeIcon style={styles.footerDetailsIcon} icon={faAngleDown} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })
        } else {
            return (
                <View style={styles.notFoundNotyContainer}>
                    <Text style={styles.notFoundNotyText}>No notifications yet</Text>
                </View>
            )
        }
    }


    return (
        <ScrollView style={{backgroundColor: colors.mainWhite,}}>
            <View style={styles.container}>
                <View style={styles.cryptoNameContainer}>
                    <Text style={styles.cryptoPageTitle}>
                        Notifications
                    </Text>
                    <View style={styles.cryptoIconContainer}>
                        <TouchableOpacity onPress={handleNavigateBack}>
                            <View style={styles.cryptoIconBlock}>
                                <FontAwesomeIcon style={styles.cryptoIcon} icon={faShop} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteNoty}>
                            <View style={styles.cryptoIconBlock}>
                                <FontAwesomeIcon style={styles.cryptoIcon} icon={faTrash} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.notyScreen}>
                    <View></View>
                    <NotyComponent />
                </View>
            </View>
        </ScrollView>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainWhite,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        height: Dimensions.get('screen').height
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
    notFoundNotyContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    notFoundNotyText: {
        fontSize: 20,
        textAlign: "center",
        marginTop: '70%',
    },
    mainTitle: {
        textAlign: "left",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    notyScreen: {
        backgroundColor: colors.mainWhite,
        paddingBottom: 80,
    },
    notyContainerWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: '100%',
        height: 70,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: colors.mainBlack,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    notyHeaderMainContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    notyHeaderContainer: {
        // width: '100%',
        // height: '100%',
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
    },
    notyHeaderIconBlock: {
        margin: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 16,
        height: 16,
    },
    notyHeaderIcon: {
        width: 16,
        height: 16,
        color: colors.mainPurple
    },
    notyHeaderTextBlock: {
        marginTop: 7,
        marginLeft: 10,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    notyHeaderText: {
        textAlign: "left",
        fontSize: 15,
    },
    notyBodyTextContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
    },
    notyBodyTextBlock: {
        marginLeft: 10,
        marginTop: 5
    },
    notyBodyMessageTitle: {
        textAlign: "left",
        fontSize: 15,
    },
    notyBodyMessageText: {
        textAlign: "left",
        fontSize: 14,
    },
    footerDetailsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 10,
        marginBottom: 5
    },
    footerDetailsBlock: {

    },
    footerDetailsText: {
        fontSize: 12,
        textAlign: "center",
    },
    footerDetailsIconBlock: {
        width: 14,
        height: 14,
    },
    footerDetailsIcon: {
        width: 14,
        height: 14,
        color: colors.mainGray,
        outlineStyle: 'none'
    },


    notyHeaderStatusIcon: {
        margin: 10
    },
    mainStatusIconContainer: {
        borderRadius: 100,
        width: 20,
        height: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    infoStatusIcon: {
        width: 12,
        height: 12,
        color: colors.mainWhite,
        outlineStyle: 'none'
    },
    riskStatusIcon: {
        width: 12,
        height: 12,
        color: colors.mainWhite,
        outlineStyle: 'none'
    },
    messageStatusIcon: {
        width: 12,
        height: 12,
        color: colors.mainWhite,
        outlineStyle: 'none'
    },

});
