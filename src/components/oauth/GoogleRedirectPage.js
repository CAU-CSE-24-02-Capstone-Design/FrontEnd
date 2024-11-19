import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {SPRING_API_URL} from "../../constants/api";

axios.defaults.withCredentials = true;

const GoogleRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthGoogle = async (code) => {
            try {
                const response = await axios.get(
                    `${SPRING_API_URL}/oauth/login/google?code=${code}`,
                    {}
                );
                if (response.data.isSuccess) {
                    const accessToken =
                        response.headers["Authorization"] ||
                        response.headers["authorization"];
                    const role = response.data.result;
                    localStorage.setItem("accessToken", accessToken);

                    if (role === "GUEST")
                        navigate("/guestrecord");
                    else if (role === "USER")
                        navigate(`/main?selfFeedback=${null}&isCompleteSpeech=${false}`);
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
        const code = searchParams.get("code");
        if (code) {
            handleOAuthGoogle(code);
        }
    }, [location, navigate]); // 의존성 배열에서 navigate 추가

    return <div>Processing...</div>;
};

export default GoogleRedirectPage;
