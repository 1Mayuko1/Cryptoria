import React, {useContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from "./Components/Navbar";
import {authRoutes, publicRoutes} from "./routes";
import Error from "./Pages/Error";
import NavbarBackdrop from "./Components/Navbar/NavbarBackdrop";
import {Context} from "./index";

const App = () => {
    const { user } = useContext(Context)

    return (
        <Router>
            <NavbarBackdrop />
            <Navbar />
            <Routes>
                {
                    user.isAuth && authRoutes.map(({path, Component}) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))
                }
                {
                    publicRoutes.map(({path, Component}) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))
                }
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
};

export default App;
