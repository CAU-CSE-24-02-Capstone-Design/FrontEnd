import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import instance from "../axios/TokenInterceptor";
import {SPRING_API_URL} from "../constants/api";

const NavBar = () => {
    const navigate = useNavigate();
    const [selfFeedback, setSelfFeedback] = useState(null);
    const [isCompleteSpeech, setIsCompleteSpeech] = useState(false);

    useEffect(() => {
        const getDoAnswerToday = async () => {
            try {
                const response = await instance.get(`${SPRING_API_URL}/answers/completions`)
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
                console.error("오늘 답변 했는 지 여부 받아오기 실패");
            }
        }

        const getBeforeSelfFeedback = async () => {
            try {
                const response = await instance.get(`${SPRING_API_URL}/self-feedbacks/latest-feedbacks`);
                if (response.data.isSuccess) {
                    if (response.data.code === "ANSWER4001" || response.data.code === "SELFFEEDBACK4001") {
                    } else {
                        setSelfFeedback(response.data.result.feedback);
                        console.log("이전 셀프 피드백 받아오기 성공");
                    }
                } else {
                    console.error("이전 셀프 피드백 받아오기 실패");
                }
            } catch (error) {
                console.error("이전 셀프 피드백 받아오기 실패");
            }
        };

        getDoAnswerToday();
        getBeforeSelfFeedback();
    }, []);

    // 하단 바 버튼 경로, 이미지, 텍스트를 저장하는 배열
    const menuItems = [
        {path: "/calendar", icon: "/webp/calendar_button.webp", label: "캘린더"},
        {
            path: `/main?selfFeedback=${selfFeedback}&isCompleteSpeech=${isCompleteSpeech}`,
            icon: "/webp/home_button.webp",
            label: "홈"
        },
        {
            path: "/statistics",
            icon: "/webp/statistics_button.webp",
            label: "통계",
        },
    ];

    return (
        <nav
            className="bottom-0 left-0 w-full max-w-[500px] mx-auto flex justify-around border-t border-slate-500 py-3">
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center"
                >
                    <img
                        src={item.icon}
                        alt={`${item.label} Icon`}
                        className="w-6 h-6 mb-1"
                    />
                    <span className="text-base font-paperlogy-title">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default NavBar;
