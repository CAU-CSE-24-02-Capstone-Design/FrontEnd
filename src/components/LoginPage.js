import React from 'react';
import axios from 'axios';
import '../css/LoginPage.css';
import Record from "./Record";
import {SPRING_API_URL} from "../constants";

axios.defaults.withCredentials = true;

const LoginPage = message => {

    // OAuth2 로그인
    const handleKakaoLoginClick = () => {
        window.location.href = `${SPRING_API_URL}/oauth/kakao`;
    };

    const handleNaverLoginClick = () => {
        window.location.href = `${SPRING_API_URL}/oauth/naver`;
    };

    const handleGoogleLoginClick = () => {
        window.location.href = `${SPRING_API_URL}/oauth/google`;
    };

    return (
        <div className="login-container">
            <h2>복숭아 멘토~</h2>
            <div className="social-login-buttons">
                <img
                    src="/images/kakao-icon.png"
                    alt="Kakao Login"
                    className="social-icon"
                    onClick={handleKakaoLoginClick}
                />
                <img
                    src="/images/naver-icon.png"
                    alt="Naver Login"
                    className="social-icon"
                    onClick={handleNaverLoginClick}
                />
                <img
                    src="/images/google-icon.png"
                    alt="Google Login"
                    className="social-icon"
                    onClick={handleGoogleLoginClick}
                />
                <Record /> {/* Record 컴포넌트 추가 */}
            </div>
        </div>
    );
};

export default LoginPage;