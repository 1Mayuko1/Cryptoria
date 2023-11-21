import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import {colors} from "../../constants/helpers";

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#99a9e7" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: colors.mainPurple
    }
});

export default LoadingScreen;
