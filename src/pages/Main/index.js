import React, {useState} from "react";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import Countdown from "./components/Countdown";
import Question from "./components/Question";
import ProgressTimer from "./components/ProgressTimer";
import Record from "../../components/Record";
import VolumeVisualizer from "./components/VolumeVisualizer";
import AISpeechPopup from "./components/AISpeechPopup";
import {ClockLoader} from "react-spinners"; // 로딩중 효과 (ClockLoader)
import {SPRING_API_URL} from "../../constants/api";
import instance from "../../axios/TokenInterceptor";
import {useNavigate} from "react-router-dom";

const Main = () => {
    const navigate = useNavigate();
    const [showCountdown, setShowCountdown] = useState(false);
    const [showProgressTimer, setShowProgressTimer] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showAISpeechPopup, setShowAISpeechPopup] = useState(false);
    const [showAnalysisMessage, setShowAnalysisMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const [answerId, setAnswerId] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [questionText, setQuestionText] = useState("");

    const handleQuestionClick = async () => {
        try {
            const response = await instance.get(`${SPRING_API_URL}/question`);
            if (response.data.isSuccess) {
                setQuestionText(response.data.result.questionDescription);
                setAnswerId(response.data.result.answerId);
                console.log(questionText)
                console.log(answerId)
            } else {
                console.error("질문 받아오기 오류");
                console.log(response.data.code);
                console.log(response.data.message);
            }
            console.log("질문 받아오기 성공");
        } catch (error) {
            console.error("질문 받아오기 실패");
        }

        setShowCountdown(true);
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        setShowProgressTimer(true); // 1분 타이머 시작
        setIsRecording(true); // 녹음 시작
    };

    const handleProgressTimeUp = async () => {
        setShowProgressTimer(false);
        setIsRecording(false); // 녹음 중지
        setLoading(true); // 로딩 시작
        setShowAnalysisMessage(true); // 분석 메시지 표시
    }

    const handleCloseAISpeechPopup = () => {
        setShowAISpeechPopup(false); // 팝업 닫기
    };

    const handleShowAISpeechPopup = async () => {
        setShowAISpeechPopup(true); // AI 답변 팝업 열기
    };

    return (
        <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-[#fcfcfc]">
            <Header/>
            <main className="flex flex-col items-center justify-center flex-grow px-4">
                {!showAnalysisMessage && !showProgressTimer && !showCountdown && (
                    <button
                        onClick={handleQuestionClick}
                        className="px-6 py-4 mt-6 text-lg text-white rounded bg-primary-50 font-paperlogy-title"
                    >
                        오늘의 질문
                    </button>
                )}

                {(showCountdown || showProgressTimer) && (
                    <Question questionText={questionText}/>
                )}

                {showCountdown && (
                    <Countdown onCountdownComplete={handleCountdownComplete}/>
                )}

                {showProgressTimer && (
                    <>
                        <ProgressTimer duration={0.25} onTimeUp={handleProgressTimeUp}/>
                        <Record
                            answerId={answerId}
                            questionText={questionText}
                            onResponse={(response) => setAiResponse(response)}
                        />
                        <VolumeVisualizer isRecording={isRecording}/>
                    </>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <p className="mb-10 text-xl font-semibold text-center text-grayscale-100">
                            답변 내용을 분석 중입니다.
                        </p>
                        <ClockLoader color="#4A90E2" loading={loading} size={60}/>
                        <button
                            onClick={handleShowAISpeechPopup}
                            className="px-8 py-3 mt-10 text-lg font-semibold text-white rounded-full bg-primary-50"
                        >
                            AI 답변 보기
                        </button>
                        <button
                            onClick={() => navigate("/recordscript")} // 화살표 함수로 변경
                            className="px-8 py-3 mt-10 text-lg font-semibold text-white rounded-full bg-primary-50"
                        >
                            피드백 받기
                        </button>
                    </div>
                )}

                <AISpeechPopup
                    isOpen={showAISpeechPopup}
                    onClose={handleCloseAISpeechPopup}
                    response={aiResponse}
                />
            </main>
            <NavBar/>
        </div>
    );
};

export default Main;
