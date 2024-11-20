import React from "react";
import {useNavigate} from "react-router-dom";
import instance from "../axios/TokenInterceptor";
import {SPRING_API_URL} from "../constants/api";

const NavBar = () => {
    const navigate = useNavigate();

    const handleMainButton = async () => {
        let isCompleteSpeech = false;
        let selfFeedback = null;

        try {
            const response = await instance.get(`${SPRING_API_URL}/answers/completions`)
            if (response.data.isSuccess) {
                if (response.data.code === "ANSWER4001" || response.data.code === "USER4002" || response.data.code === "ACCESSTOKEN4002") {
                    console.error("오늘 답변 했는 지 여부 받아오기 API 서버 에러");
                } else {
                    if (response.data.result.answerExists) {
                        isCompleteSpeech = true;
                    } else {
                        isCompleteSpeech = false;
                    }
                    console.log("오늘 답변 했는 지 여부 받아오기 성공");
                }
            } else {
                console.error("오늘 답변 했는 지 여부 받아오기 실패");
            }
        } catch (error) {
            console.error("오늘 답변 했는 지 여부 받아오기 실패");
        }
        try {
            const response = await instance.get(`${SPRING_API_URL}/self-feedbacks/latest-feedbacks`);
            if (response.data.isSuccess) {
                if (response.data.code === "ANSWER4001" || response.data.code === "SELFFEEDBACK4001") {
                } else {
                    selfFeedback = response.data.result.feedback;
                    console.log("이전 셀프 피드백 받아오기 성공");
                }
            } else {
                console.error("이전 셀프 피드백 받아오기 실패");
            }
        } catch (error) {
            console.error("이전 셀프 피드백 받아오기 실패");
        }
        navigate(`/main?selfFeedback=${selfFeedback}&isCompleteSpeech=${isCompleteSpeech}`);
    }

    return (
        <nav
            className="bottom-0 left-0 w-full max-w-[500px] mx-auto flex justify-around border-t border-slate-500 py-3"
        >
            <button
                onClick={() => navigate("/calendar")}
                className="flex flex-col items-center"
            >
                <img
                    src="/webp/calendar_button.webp"
                    alt="캘린더 Icon"
                    className="w-6 h-6 mb-1"
                />
                <span className="text-base font-paperlogy-title">캘린더</span>
            </button>

            <button
                onClick={handleMainButton}
                className="flex flex-col items-center"
            >
                <img
                    src="/webp/home_button.webp"
                    alt="홈 Icon"
                    className="w-6 h-6 mb-1"
                />
                <span className="text-base font-paperlogy-title">홈</span>
            </button>

            <button
                onClick={() => navigate("/statistics")}
                className="flex flex-col items-center"
            >
                <img
                    src="/webp/statistics_button.webp"
                    alt="통계 Icon"
                    className="w-6 h-6 mb-1"
                />
                <span className="text-base font-paperlogy-title">통계</span>
            </button>
        </nav>
    );
};

export default NavBar;
