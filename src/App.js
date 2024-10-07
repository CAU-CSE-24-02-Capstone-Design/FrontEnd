import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import KakaoRedirectPage from './components/oauth/KakaoRedirectPage';
import NaverRedirectPage from './components/oauth/NaverRedirectPage';
import GoogleRedirectPage from './components/oauth/GoogleRedirectPage';
import Main from './components/Main';

import './App.css';

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/login/oauth2/code/kakao" element={<KakaoRedirectPage/>}/>
                    <Route path="/login/oauth2/code/naver" element={<NaverRedirectPage/>}/>
                    <Route path="/login/oauth2/code/google" element={<GoogleRedirectPage/>}/>
                    <Route path="/main" element={<Main/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;