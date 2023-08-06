import {
    ADMIN_ROUTE,
    EMPTY_ROUTE,
    GUIDES_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    MARKETS_ROUTE,
    NEWS_ROUTE,
    PRODUCTS_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE
} from './utils/consts'
import Admin from "./Pages/Admin";
import Guides from "./Pages/Guides";
import Home from "./Pages/Home/Home";
import AuthPage from "./Pages/AuthPage";
import Markets from "./Pages/Markets";
import News from "./Pages/News";
import Products from "./Pages/Products";
import Profile from "./Pages/Profile";
export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
]

export const publicRoutes = [
    {
        path: GUIDES_ROUTE,
        Component: Guides
    },
    {
        path: GUIDES_ROUTE,
        Component: Guides
    },
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: LOGIN_ROUTE,
        Component: AuthPage
    },
    {
        path: REGISTRATION_ROUTE,
        Component: AuthPage
    },
    {
        path: MARKETS_ROUTE,
        Component: Markets
    },
    {
        path: NEWS_ROUTE,
        Component: News
    },
    {
        path: PRODUCTS_ROUTE,
        Component: Products
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: EMPTY_ROUTE,
        Component: Home
    }
]