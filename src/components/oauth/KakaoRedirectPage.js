import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {SPRING_API_URL} from "../../constants/api";
import instance from "../../axios/TokenInterceptor";

axios.defaults.withCredentials = true;

const KakaoRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selfFeedback, setSelfFeedback] = useState(null);
    const [isCompleteSpeech, setIsCompleteSpeech] = useState(false);

    useEffect(() => {
        const handleOAuthKakao = async (code) => {
            try {
                const response = await axios.get(
                    `${SPRING_API_URL}/oauth/login/kakao?code=${code}`,
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
                    else if (role === "USER") {
                        await Promise.all([getDoAnswerToday(), getBeforeSelfFeedback()]);
                    }
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
            handleOAuthKakao(code);
        }
    }, [location, navigate]); // 의존성 배열에서 navigate 추가

    const getDoAnswerToday = async () => {
        try {
            const response = await instance.get(`${SPRING_API_URL}/answers/completions`);
            if (response.data.isSuccess) {
                if (response.data.code === "ANSWER4001" || response.data.code === "USER4002" || response.data.code === "ACCESSTOKEN4002") {
                    console.error("오늘 답변 했는 지 여부 받아오기 API 서버 에러");
                } else {
                    if (response.data.result.answerExists) {
                        setIsCompleteSpeech(true);
                    } else {
                        setIsCompleteSpeech(false);
                    }
                    console.log("오늘 답변 했는 지 여부 받아오기 성공");
                }
            } else {
                console.error("오늘 답변 했는 지 여부 받아오기 실패");
            }
        } catch (error) {
            console.error("오늘 답변 했는 지 여부 받아오기 실패", error);
        }
    };

    const getBeforeSelfFeedback = async () => {
        try {
            const response = await instance.get(`${SPRING_API_URL}/self-feedbacks/latest-feedbacks`);
            if (response.data.isSuccess) {
                if (response.data.code === "ANSWER4001" || response.data.code === "SELFFEEDBACK4001") {
                    console.log("이전 셀프 피드백 없음");
                } else {
                    setSelfFeedback(response.data.result.feedback);
                    console.log("이전 셀프 피드백 받아오기 성공");
                }
            } else {
                console.error("이전 셀프 피드백 받아오기 실패");
            }
        } catch (error) {
            console.error("이전 셀프 피드백 받아오기 실패", error);
        }
    };

    useEffect(() => {
        navigate(`/main?selfFeedback=${selfFeedback}&isCompleteSpeech=${isCompleteSpeech}`);
    }, [selfFeedback, isCompleteSpeech, navigate]); // selfFeedback, isCompleteSpeech 값 변경될 때마다 호출


    return <div>Processing...</div>;
};

export default KakaoRedirectPage;
