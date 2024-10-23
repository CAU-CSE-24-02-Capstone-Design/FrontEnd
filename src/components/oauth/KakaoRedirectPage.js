import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

const KakaoRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthKakao = async (code) => {
            try {
                const response = await axios.get(`http://localhost:8080/oauth/login/kakao?code=${code}`, {});
                if (response.data.isSuccess) {
                    const accessToken = response.headers['Authorization'] || response.headers['authorization'];
                    localStorage.setItem('accessToken', accessToken);
                    navigate("/main");
                } else {
                    console.error("OAuth2 로그인 오류");
                    console.log(response.data.code);
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error("로그인 실패", error);
            }
        };

        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        if (code) {
            handleOAuthKakao(code);
        }
    }, [location, navigate]); // 의존성 배열에서 navigate 추가

    return <div>Processing...</div>;
};

export default KakaoRedirectPage;