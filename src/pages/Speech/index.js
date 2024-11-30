import React, {useState} from "react";
import Header from "../../components/Header";
import Countdown from "./components/Countdown";
import Question from "./components/Question";
import ProgressTimer from "./components/ProgressTimer";
import Record from "./components/Record";
import AISpeechPopup from "./components/AISpeechPopup";
import Loading from "./components/Loading";
import UserMemo from "./components/UserMemo";
import {useLocation, useNavigate} from "react-router-dom";

const Speech = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const answerId = parseInt(searchParams.get("answerId"), 10);
    const questionText = searchParams.get("questionText");
    const level = searchParams.get("level");
    const canStop = searchParams.get("canStop") === "true";

    const [showCountdown, setShowCountdown] = useState(true);
    const [showProgressTimer, setShowProgressTimer] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showAISpeechPopup, setShowAISpeechPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [insightComplete, setInsightComplete] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    const [audioUrl, setAudioUrl] = useState(null);
    const [onRec, setOnRec] = useState(false);
    const [aiResponse, setAiResponse] = useState("");

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        setShowProgressTimer(true); // 1분 타이머 시작
        setIsRecording(true); // 녹음 시작
    };

    const handleStopRecording = async () => {
        setIsRecording(false); // 녹음 중지
        setOnRec(true);
    };

    const handleProgressTimeUp = async () => {
        setShowProgressTimer(false);
        setLoading(true); // 로딩 시작
    };

    const handleCloseAISpeechPopup = () => {
        setShowAISpeechPopup(false); // 팝업 닫기
    };

    const handleShowAISpeechPopup = async () => {
        setShowAISpeechPopup(true); // AI 답변 팝업 열기
    };

    return (
        <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-white">
            <Header/>
            <main className="flex flex-col items-center justify-center flex-grow px-4">
                {/* 질문 내용 표시 */}
                {(showCountdown || showProgressTimer) && (
                    <Question questionText={questionText}/>
                )}

                {/* 카운트다운 컴포넌트 */}
                {showCountdown && (
                    <Countdown
                        level={level}
                        onCountdownComplete={handleCountdownComplete}
                    />
                )}

                {/* 타이머 및 녹음 컴포넌트 */}
                {showProgressTimer && (
                    <>
                        <ProgressTimer
                            level={level}
                            onTimeUp={handleStopRecording}
                        />
                        <p className="mt-6 -mb-4 text-sm text-center font-paperlogy-title text-grayscale-90">
                            {canStop ? (
                                level === "1" ? (
                                    <>
                                        스피치가 끝났다면 아래 버튼을 클릭하여 종료할 수 있습니다
                                        <br/>
                                        위 질문에 대한 답변 시간은 30초
                                    </>
                                ) : level === "2" ? (
                                    <>
                                        스피치가 끝났다면 아래 버튼을 클릭하여 종료할 수 있습니다
                                        <br/>
                                        위 질문에 대한 답변 시간은 1분
                                    </>
                                ) : level === "3" ? (
                                    <>
                                        스피치가 끝났다면 아래 버튼을 클릭하여 종료할 수 있습니다
                                        <br/>
                                        위 질문에 대한 답변 시간은 2분
                                    </>
                                ) : null
                            ) : (
                                level === "1" ? (
                                    <>
                                        제한시간 30초동안 최대한 말해보세요!
                                        <br/>
                                        위 질문에 대한 답변 시간은 30초
                                    </>
                                ) : level === "2" ? (
                                    <>
                                        제한시간 1분동안 최대한 말해보세요!
                                        <br/>
                                        위 질문에 대한 답변 시간은 1분
                                    </>
                                ) : level === "3" ? (
                                    <>
                                        제한시간 2분동안 최대한 말해보세요!
                                        <br/>
                                        위 질문에 대한 답변 시간은 2분
                                    </>
                                ) : null
                            )}
                        </p>
                        <Record
                            canStop={canStop}
                            setAudioUrl={setAudioUrl}
                            isRecording={isRecording}
                            onRec={onRec}
                            setOnRec={setOnRec}
                            answerId={answerId}
                            questionText={questionText}
                            onResponse={(response) => setAiResponse(response)}
                            setInsightComplete={setInsightComplete}
                            setAnalysisComplete={setAnalysisComplete}
                            handleProgressTimeUp={handleProgressTimeUp}
                            handleStopRecording={handleStopRecording}
                        />
                    </>
                )}

                {/* 분석 중일 때 로딩 상태 표시 */}
                {loading && (
                    <div className="flex flex-col items-center justify-center w-full">
                        {/* 분석 중 로딩 애니메이션 */}
                        <Loading/>

                        {/* AI 답변 보기 및 피드백 받기 버튼 */}
                        <div className="flex justify-center -mt-10">
                            <button
                                onClick={handleShowAISpeechPopup}
                                className={`px-5 py-3 text-lg font-semibold text-white rounded-full mr-6 ${
                                    insightComplete
                                        ? "bg-primary-50"
                                        : "bg-primary-10 cursor-not-allowed"
                                }`}
                                disabled={!insightComplete}
                            >
                                AI 답변 보기
                            </button>
                            {/* 분석이 완료되어야 활성화되는 "피드백 받기" 버튼 */}
                            <button
                                onClick={() => navigate("/recordscript")}
                                className={`px-5 py-3 text-lg font-semibold text-white rounded-full ${
                                    analysisComplete
                                        ? "bg-primary-50"
                                        : "bg-primary-10 cursor-not-allowed"
                                }`}
                                disabled={!analysisComplete}
                            >
                                피드백 받기
                            </button>
                        </div>

                        {/* 사용자 개인 평가 메모장 */}
                        <UserMemo audioUrl={audioUrl}/>
                    </div>
                )}

                {/* AI 답변 팝업 */}
                <AISpeechPopup
                    isOpen={showAISpeechPopup}
                    onClose={handleCloseAISpeechPopup}
                    response={aiResponse}
                />
            </main>
        </div>
    );
};

export default Speech;
