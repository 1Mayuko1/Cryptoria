import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../constants/helpers";
import {faAngleDown, faComment, faEnvelope, faExclamation, faInfo, faMessage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";


const Notifications = () => {

    const allNoty = [
        {'id': '0', 'status': 'info', 'date': '2023.12.04', 'time': '16:40', 'messageTitle': 'Forecast successfully complete', 'messageText': 'Some details', 'data': []},
        {'id': '1', 'status': 'risk', 'date': '2023.12.04', 'time': '16:40', 'messageTitle': 'Some job not completed', 'messageText': 'Some details', 'data': []},
        {'id': '2', 'status': 'message', 'date': '2023.12.04', 'time': '16:40', 'messageTitle': 'Forecast successfully complete', 'messageText': 'Some details', 'data': []},
        {'id': '3', 'status': 'message', 'date': '2023.12.04', 'time': '16:40', 'messageTitle': 'Forecast successfully complete', 'messageText': 'Some details', 'data': []},
        {'id': '4', 'status': 'info', 'date': '2023.12.04', 'time': '16:40', 'messageTitle': 'Forecast successfully complete', 'messageText': 'Some details', 'data': []},
    ]

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
        } else if (status === 'message') {
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
        console.log('testas', elId)
    }

    const NotyComponent = () => {
       return allNoty.map((noty, idx) => {
            return (
                <View style={styles.notyContainerWrapper}>
                    <View style={styles.notyHeaderMainContainer}>
                        <View style={styles.notyHeaderContainer}>
                            {/*<View style={styles.notyHeaderIconBlock}>*/}
                            {/*    <FontAwesomeIcon style={styles.notyHeaderIcon} icon={faEnvelope} />*/}
                            {/*</View>*/}
                            <View style={styles.notyHeaderTextBlock}>
                                <Text style={styles.notyHeaderText}>
                                    {`New message • Today, ${noty.time}`}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.notyHeaderStatusIcon}>
                            {displayStatusIcon(noty.status)}
                        </View>
                    </View>
                    {/*<View style={styles.notyBodyTextContainer}>*/}
                    {/*    <View style={styles.notyBodyTextBlock}>*/}
                    {/*        <Text style={styles.notyBodyMessageTitle}>*/}
                    {/*            {`${noty.messageTitle}`}*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*    <View style={styles.notyBodyTextBlock}>*/}
                    {/*        <Text style={styles.notyBodyMessageText}>*/}
                    {/*            {`${noty.messageText}`}*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
                    <View style={styles.footerDetailsContainer}>
                        <TouchableOpacity onPress={openNotySection(noty.id)}>
                            <View style={styles.footerDetailsIconBlock}>
                                <FontAwesomeIcon style={styles.footerDetailsIcon} icon={faAngleDown} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        })
    }


    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.mainTitle}>
                    Notifications
                </Text>
                <NotyComponent />
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
        height: Dimensions.get('window').height
    },
    mainTitle: {
        textAlign: "left",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    notyContainerWrapper: {
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
        marginTop: 15,
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
