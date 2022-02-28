import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {AuthProvider} from "./contexts/AuthContext";
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ChakraProvider>
                    <App/>
                </ChakraProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

