import React, {useEffect, useState} from 'react';
import Home from "../Pages/Home";
import Portfolio from "../Pages/Portfolio";
import Market from "../Pages/Market";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useScreenDimensions} from "../constants/helpers";
import {View} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import Cryptocurrency from "../Pages/Market/Cryptocurrency";
import Login from "../Pages/Login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Registration from "../Pages/Registration";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const MainStack = createStackNavigator();


const MarketStackScreen = () => {
    return(
        <Stack.Navigator initialRouteName="Market" screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Market"
                component={Market}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Market',
                    tabBarIcon: () => (
                        <View>
                            <Icon
                                name={'ra'}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="Cryptocurrency"
                component={Cryptocurrency}
            />
        </Stack.Navigator>
    )
}

const LoginStack = () => (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
);

const AuthenticatedStack = () => (
    <Tab.Navigator
        shifting={true}
        sceneAnimationEnabled={true}
        activeTintColor="#000000"
        initialRouteName="Market"
        activeColor="#fff"
        inactiveColor="#000"
        labelStyle={{ fontSize: 12 }}
        barStyle={{
            backgroundColor: '#000',
        }}
    >
        <Tab.Screen
            name='Home'
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: () => (
                    <View>
                        <Icon
                            style={[{color: '#fff'}]}
                            size={25}
                            name={'search'}
                        />
                    </View>
                ),
            }}
            component={Home}
        />
        <Tab.Screen
            name='Market'
            options={{
                tabBarLabel: 'Market',
                tabBarIcon: () => (
                    <View>
                        <Icon
                            style={[{color: '#fff'}]}
                            size={23}
                            name={'ra'}
                        />
                    </View>
                ),
            }}
            component={MarketStackScreen}
        />
        <Tab.Screen
            name='Portfolio'
            options={{
                tabBarLabel: 'Portfolio',
                tabBarIcon: () => (
                    <View>
                        <Icon
                            style={[{color: '#fff'}]}
                            size={28}
                            name={'user'}
                        />
                    </View>
                ),
            }}
            component={Portfolio}
        />
    </Tab.Navigator>
)

const RootNavigator = () => {
    const screenData = useScreenDimensions()
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error('Failed to get token from AsyncStorage', e);
            }
        };

        checkToken();
    }, []);

    return (
        <NavigationContainer theme={{colors: {secondaryContainer: 'transparent'}}}>
            <MainStack.Navigator initialRouteName={isAuthenticated ? "Authenticated" : "Login"} screenOptions={{ headerShown: false }}>
                <MainStack.Screen name="Authenticated" component={AuthenticatedStack} />
                <MainStack.Screen name="Login" component={LoginStack} />
            </MainStack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator
