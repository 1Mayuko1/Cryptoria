import React, {useState, useContext} from "react";
import {
    View, Text,
    StyleSheet, Dimensions,
} from 'react-native'
import { Button } from "react-native-elements";
import {BtnTheme, colors, useScreenDimensions} from "../constants/helpers";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import {login} from "../http/userApi";
import {Context} from "../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {

    const {user} = useContext(Context)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [note, setNote] = useState('')

    const loginHandler = async () => {
        if (typeof password === 'string' || password instanceof String) {
            if (password.trim().length === 0) {
                return setNote('Поле "Пароль" пусте або містить тільки пробіл');
            } else if (email.trim().length === 0) {
                return setNote('Поле "Email" пусте або містить тільки пробіл');
            } else {
                try {
                    let data = await login(email, password)
                    console.log('data', data)
                    if (data) {
                        user.setUser(data)
                        user.setIsAuth(true)
                    }

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Authenticated', params: { screen: 'Market' } }],
                    });
                } catch (e) {
                    if (e.response && e.response.data) {
                        setNote(`Error when log in: ${e.response.data.message}`);
                    } else {
                        setNote('Error when log in something undefined');
                        console.log(e);
                    }
                }
            }
        }
    }

    const onChangeEmailHandler = (value) => {
        setEmail(value)
    }

    const onChangePasswordHandler = (value) => {
        setPassword(value)
    }

    const screenData = useScreenDimensions();

    const goToRegistration = () => {
        setEmail('')
        setPassword('')
        navigation.navigate('Registration');
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{
                marginTop: screenData.isLandscape ?
                    Dimensions.get('screen').width / 2 :
                    '60%',
                flex: 0,
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: screenData.isLandscape ? '95%' : '90%',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                marginBottom: screenData.isLandscape ? 0 : '5%',
            }}>
                <View style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: screenData.isLandscape ? 10 : 20,
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '80%'
                }}>
                    <Input
                        placeholder='Пошта'
                        onChangeText={e => onChangeEmailHandler(e)}
                        value={email}
                        style={{ outline: 'none' }}
                        leftIcon={
                            <Icon
                                style={{marginRight: 6}}
                                name='mail-forward'
                                size={20}
                                color={colors.mainBlack}
                            />
                        }
                    />
                    <Input
                        placeholder='Пароль'
                        onChangeText={e => onChangePasswordHandler(e)}
                        value={password}
                        secureTextEntry={true}
                        style={{ outline: 'none' }}
                        leftIcon={
                            <Icon
                                style={{marginRight: 10}}
                                name='lock'
                                size={24}
                                color={colors.mainBlack}
                            />
                        }
                    />
                    <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-around'}}>
                        <View style={{display: "flex", flexDirection: "column"}}>
                            <Text>Забули пароль ?</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "column"}}>
                            <Text onPress={goToRegistration}>Зареєструватись ?</Text>
                        </View>
                    </View>
                    {
                        note !== '' ?
                            <View style={styles.noteContainer}>
                                {/*<Text style={styles.errText}>Note: </Text>*/}
                                <Text style={styles.note}>{note}</Text>
                            </View>
                            : null
                    }
                </View>
                <View style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginTop: note === '' ? 100 : 50,
                    fontSize: screenData.isLandscape ? 18 : 20,
                    width: screenData.isLandscape ?
                        Dimensions.get('screen').width / 2 :
                        '50%'
                }}>
                    <Button
                        title="Увійти"
                        theme={BtnTheme}
                        onPress={loginHandler}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: colors.mainBlack,
    },
    link: {
        fontWeight: 'bold',
        color: colors.mainBlack,
    },
    noteContainer: {
        marginTop: 30,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    note: {
        flexDirection: 'column',
        color: colors.mainColor,
        fontSize: 18,
        textAlign: 'center',
    },
    errText: {
        color: colors.mainColor,
        fontWeight: 'bold',
        flexDirection: 'column',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Login
