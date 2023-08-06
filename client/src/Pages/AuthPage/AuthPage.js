import React, { useState } from 'react';
import './AuthPage.css'
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "../../utils/consts";
import logoV1 from '../../helpers/images/logoV1.png'

const AuthPage = () => {
    const navigate  = useNavigate();
    // login
    const [loginEmailInput, setLoginEmailInput] = useState('')
    const [loginPasswordInput, setLoginPasswordInput] = useState('')
    // registration
    const [registrationEmailInput, setRegistrationEmailInput] = useState('')
    const [registrationPasswordInput, setRegistrationPasswordInput] = useState('')
    const [registrationRepeatPasswordInput, setRegistrationRepeatPasswordInput] = useState('')

    const location = useLocation();
    const showLoginForm = [LOGIN_ROUTE].includes(location.pathname);

    const handleChangeLoginEmail = (e) => {
        setLoginEmailInput(e.target.value)
    }

    const handleChangeLoginPassword = (e) => {
        setLoginPasswordInput(e.target.value)
    }

    const handleChangeRegistrationEmail = (e) => {
        setRegistrationEmailInput(e.target.value)
    }

    const handleChangeRegistrationPassword = (e) => {
        setRegistrationPasswordInput(e.target.value)
    }

    const handleChangeRegistrationRepeatPassword = (e) => {
        setRegistrationRepeatPasswordInput(e.target.value)
    }

    const onSubmitRegistrationFrom = (e) => {
        console.log('submit login clicked')
    }

    const onSubmitLoginFrom = (e) => {
        console.log('submit login clicked')
    }

    const goToLoginPage = () => {
        navigate(LOGIN_ROUTE);
    }

    const goToRegistrationPage = () => {
        navigate(REGISTRATION_ROUTE);
    }

    const goToHomePage = () => {
        navigate(HOME_ROUTE);
    };

    if (showLoginForm) {
        return (
            <div className={'loginFromContainer'}>
                <div className={'formLogoContainer'} onClick={goToHomePage}>
                    <img src={logoV1} alt={'logo'} className={'loginLogoImage'} />
                </div>
                <form className={'loginForm'} onSubmit={(e) => onSubmitLoginFrom(e)}>
                    <div className={'loginFormInputContainer'}>
                        <div className={'loginInputLabel'}>
                            Email
                        </div>
                        <div className={'loginFormInput'}>
                            <input value={loginEmailInput} placeholder={'Email'} onChange={(e) => handleChangeLoginEmail(e)}/>
                        </div>
                    </div>
                    <div className={'loginFormInputContainer'}>
                        <div className={'loginInputLabel'}>
                            Password
                        </div>
                        <div className={'loginFormInput'}>
                            <input value={loginPasswordInput} placeholder={'Password'} onChange={(e) => handleChangeLoginPassword(e)}/>
                        </div>
                    </div>
                    <div className={'loginFormButtonsContainer registrationButtons'}>
                        <div className={'goToLoginButton'} onClick={goToRegistrationPage}>
                            Registration
                        </div>
                        <div className={'loginSubmitButton'} onSubmit={onSubmitRegistrationFrom}>
                            Continue
                        </div>
                    </div>
                </form>
            </div>
        );
    } else {
        return (
            <div className={'loginFromContainer'}>
                <div className={'formLogoContainer'} onClick={goToHomePage}>
                    <img src={logoV1} alt={'logo'} className={'loginLogoImage'}/>
                </div>
                <form className={'loginForm'} onSubmit={(e) => onSubmitRegistrationFrom(e)}>
                    <div className={'loginFormInputContainer'}>
                        <div className={'loginInputLabel'}>
                            Email
                        </div>
                        <div className={'loginFormInput'}>
                            <input value={registrationEmailInput} placeholder={'Email'} onChange={(e) => handleChangeRegistrationEmail(e)}/>
                        </div>
                    </div>
                    <div className={'loginFormInputContainer'}>
                        <div className={'loginInputLabel'}>
                            Password
                        </div>
                        <div className={'loginFormInput'}>
                            <input value={registrationPasswordInput} placeholder={'Password'} onChange={(e) => handleChangeRegistrationPassword(e)}/>
                        </div>
                    </div>
                    <div className={'loginFormInputContainer'}>
                        <div className={'loginInputLabel'}>
                            Password again
                        </div>
                        <div className={'loginFormInput'}>
                            <input value={registrationRepeatPasswordInput} placeholder={'Password'} onChange={(e) => handleChangeRegistrationRepeatPassword(e)}/>
                        </div>
                    </div>
                    <div className={'loginFormButtonsContainer registrationButtons'}>
                        <div className={'goToLoginButton'} onClick={goToLoginPage}>
                            Already have account ?
                        </div>
                        <div className={'loginSubmitButton'} onSubmit={onSubmitRegistrationFrom}>
                            Continue
                        </div>
                    </div>
                </form>
            </div>
        )
    }
};

export default AuthPage;