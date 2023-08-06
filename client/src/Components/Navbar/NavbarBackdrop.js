import React from 'react';
import './Navbar.css'
import {useLocation} from "react-router-dom";
import {authRoutes, publicRoutes} from "../../routes";
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "../../utils/consts";

const NavbarBackdrop = () => {
    const location = useLocation();
    const isKnownRoute = [
        LOGIN_ROUTE, REGISTRATION_ROUTE,
        ...publicRoutes.map(route => route.path),
        ...authRoutes.map(route => route.path)
    ].includes(location.pathname);

    const hideNavbarForPaths = [LOGIN_ROUTE, REGISTRATION_ROUTE, ADMIN_ROUTE];
    const showNavbar = !hideNavbarForPaths.includes(location.pathname);

    if (showNavbar && isKnownRoute) {
        return (
            <div className={'navbarBackdrop'} />
        );
    } else {
        return <></>
    }
};

export default NavbarBackdrop;