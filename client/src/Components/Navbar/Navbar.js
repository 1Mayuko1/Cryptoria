import React, {useContext, useRef, useState} from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
import logoText from '../../helpers/images/logoText.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../../utils/consts";
import {authRoutes, publicRoutes} from "../../routes";
import {Context} from "../../index";

const Navbar = () => {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [searchDropdownVisible, setSearchDropdownVisible] = useState(false)
    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false)

    const location = useLocation();
    const { user } = useContext(Context)
    const inputRef = useRef(null);

    const isKnownRoute = [
        LOGIN_ROUTE, REGISTRATION_ROUTE,
        ...publicRoutes.map(route => route.path),
        ...authRoutes.map(route => route.path)
    ].includes(location.pathname);

    const hideNavbarForPaths = [LOGIN_ROUTE, REGISTRATION_ROUTE, ADMIN_ROUTE];
    const showNavbar = !hideNavbarForPaths.includes(location.pathname);

    const toggleProfileDropdown = () => {
        setProfileDropdownVisible(!profileDropdownVisible)
    }

    const ProfileDropdown = () => {
        if (profileDropdownVisible) {
            return (
                <ClickAwayListener onClickAway={toggleProfileDropdown}>
                    <div className={'profileDropdownContainer'}>
                        <div className={'profileDropdownElement'}>
                            Option 1
                        </div>
                        <div className={'profileDropdownElement'}>
                            Option 2
                        </div>
                        {
                            user.isAuth ?
                                <Link className={'profileDropdownElement dropdownLink'} to={'/'}>Log out</Link> :
                                <Link className={'profileDropdownElement dropdownLink'} to={'/login'}>Log in</Link>
                        }
                    </div>
                </ClickAwayListener>
            )
        } else return <></>
    }

    const handleCloseSearchModal = () => {
        if (searchDropdownVisible) {
            setSearchDropdownVisible(false)
        }
    }

    const handleOpenSearchModal = () => {
        setSearchDropdownVisible(true)
        setTimeout(() => {
            inputRef.current.focus();
        }, 10)
    }

    const handleInputChange = (value) => {
        setSearchInputValue(value)
    }

    const handleClearInput = () => {
        setSearchInputValue('')
    }

    if (showNavbar && isKnownRoute) {
        if (!searchDropdownVisible) {
            return (
                <div className={'navbarContainer'}>
                    <div className={'navLogoContainer'}>
                        {/*<div className={'logoImageContainer'}>*/}
                        {/*    <img className={'logoImage'} src={logoImage} alt={'logo'}/>*/}
                        {/*</div>*/}
                        <div className={'logoTextContainer'}>
                            <img className={'logoText'} src={logoText} alt={'logoText'} />
                        </div>
                    </div>
                    <div className={'centerContainer'}>
                        <div className={'searchNavContainer'} onClick={handleOpenSearchModal}>
                            <div className={'searchNavBlock'}>
                                <div className={'searchIconBlock'}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </div>
                                <div className={'searchInputBlock'}>
                                    <div className={'searchButton'}>Search</div>
                                </div>
                            </div>
                        </div>
                        <div className={'linkNavTab homeContainer'}>
                            <Link to={'/'} className={`navLinkContainer ${location.pathname === '/' ? 'currentActivePageText' : ''}`}>
                                Home
                            </Link>
                        </div>
                        <div className={'linkNavTab guidesContainer'}>
                            <Link to={'/guides'} className={`navLinkContainer ${location.pathname === '/guides' ? 'currentActivePageText' : ''}`}>
                                Guides
                            </Link>
                        </div>
                        <div className={'linkNavTab marketsContainer'}>
                            <Link to={'/markets'} className={`navLinkContainer ${location.pathname === '/markets' ? 'currentActivePageText' : ''}`}>
                                Markets
                            </Link>
                        </div>
                        <div className={'linkNavTab newsContainer'}>
                            <Link to={'/news'} className={`navLinkContainer ${location.pathname === '/news' ? 'currentActivePageText' : ''}`}>
                                News
                            </Link>
                        </div>
                        <div className={'linkNavTab productsContainer'}>
                            <Link to={'/products'} className={`navLinkContainer ${location.pathname === '/products' ? 'currentActivePageText' : ''}`}>
                                Products
                            </Link>
                        </div>
                    </div>
                    <div className={'rightSideContainer'}>
                        <div className={'rightBlockIcon profileContainer'}>
                            <div className={'profileIconContainer'} onClick={toggleProfileDropdown}>
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <ProfileDropdown />
                        </div>
                        <div className={'rightBlockIcon settingsContainer'}>
                            <div className={'settingsIconContainer'}>
                                <FontAwesomeIcon icon={faSliders} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <ClickAwayListener onClickAway={handleCloseSearchModal}>
                    <div className={'navbarSearchInputDropdownContainer'}>
                        <div className={'navbarSearchContainer'}>
                            <div className={'searchInputDropdownContainer'}>
                                <div className={'leftSideDropdownContainer'}>
                                    <div className={'searchIconDropdownBlock'}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    </div>
                                </div>
                                <div className={'searchInputContainer'}>
                                    <input
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        value={searchInputValue}
                                        className={'searchInput'}
                                        placeholder={'Symbol, eg. Bitcoin'}
                                        ref={inputRef}
                                    />
                                </div>
                                <div className={'rightSideDropdownContainer'}>
                                    <div className={'clearTextBlock'} onClick={handleClearInput}>
                                        Clear
                                    </div>
                                    <div className={'clearIconBlock'} onClick={handleCloseSearchModal}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'searchDropdownOverlay'} onClick={handleCloseSearchModal} />
                        <div className={'dropdownSearchMenuContainer'}>
                            <div className={'dropdownSearchMenuContent'}>

                            </div>
                        </div>
                    </div>
                </ClickAwayListener>
            )
        }
    }
};

export default Navbar;