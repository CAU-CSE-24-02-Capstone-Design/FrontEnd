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
            const response = await instance.get(`${SPRING_API_URL}/feedbacks/completions`)
            if (response.data.isSuccess) {
                if (response.data.code === "USER4002" || response.data.code === "ACCESSTOKEN4002") {
                    console.error("오늘 답변 했는 지 여부 받아오기 API 서버 에러");
                } else {
                    if (response.data.result.speechExists) {
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
            const response = await instance.get(
                `${SPRING_API_URL}/self-feedbacks/latest-feedbacks`
            );
            if (response.data.isSuccess) {
                if (
                    response.data.code === "ANSWER4001" ||
                    response.data.code === "SELFFEEDBACK4001"
                ) {
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
        navigate(
            `/main?selfFeedback=${selfFeedback}&isCompleteSpeech=${isCompleteSpeech}`
        );
    };

    const handleStatisticsButton = async () => {
        let statisticsData = [];
        try {
            const response = await instance.get(
                `${SPRING_API_URL}/statistics`
            );
            if (response.data.isSuccess) {
                if (response.data.code === "STATISTICS2001") {
                    statisticsData = response.data.result.map(item => ({
                        day: item.day, // 날짜 그대로 사용
                        추임새: item.gantourCount, // 'gantourCount' 값을 '추임새'로 변환
                        침묵시간: item.silentTime // 'silentTime' 값을 '침묵시간'으로 변환
                    }));
                } else if (response.data.code === "STATISTICS4001") {
                    console.error("통계 데이터 받아오기 실패");
                }
            }
        } catch (error) {
            console.error("통계 데이터 받아오기 실패");
        }

        let analysisText = "";
        try {
            const response = await instance.get(`${SPRING_API_URL}/analysis`);
            if (response.data.isSuccess) {
                if (response.data.code === "STATISTICS2003") {
                    analysisText = response.data.result.analysisText;
                    console.log("유저 7일 분석 레포트 받아오기 완료");
                } else {
                    console.error("유저 7일 분석 레포트 받아오기 api 오류");
                }
            } else {
                console.error("서버 에러");
            }
        } catch (error) {
            console.error("유저 7일 분석 레포트 받아오기 실패");
        }

        navigate(`/statistics?statisticsData=${encodeURIComponent(JSON.stringify(statisticsData))}&analysisText=${encodeURIComponent(JSON.stringify(analysisText))}`);
    }

    return (
        <nav
            className="bottom-0 left-0 w-full max-w-[500px] mx-auto flex justify-around border-t border-slate-500 py-3 bg-white">
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

            <button onClick={handleMainButton} className="flex flex-col items-center">
                <img
                    src="/webp/home_button.webp"
                    alt="홈 Icon"
                    className="w-6 h-6 mb-1"
                />
                <span className="text-base font-paperlogy-title">홈</span>
            </button>

            <button
                onClick={handleStatisticsButton}
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
