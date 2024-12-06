import React, {useContext, useEffect, useState} from "react";
import {FaStar} from "react-icons/fa";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import AISpeechPopup from "./components/AISpeechPopup";
import ScriptBox from "./components/ScriptBox";
import SelfFeedbackPopup from "./components/SelfFeedbackPopup";
import instance from "../../axios/TokenInterceptor";
import {SPRING_API_URL} from "../../constants/api";
import {NotificationContext} from "../../context/NotificationProvider";

const userImage = "/images/record_user.png";
const aiImage = "/images/record_ai.png";
const feedbackImage = "/images/record_feedback.png";

const RecordScript = ({selectedDate}) => {
    const [userAudioUrl, setUserAudioUrl] = useState("");
    const [aiAudioUrl, setAiAudioUrl] = useState("");
    const [userScript, setUserScript] = useState("");
    const [aiScript, setAiScript] = useState("");
    const [feedback, setFeedback] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    const [isUserScriptOpen, setIsUserScriptOpen] = useState(false);
    const [isAiScriptOpen, setIsAiScriptOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // AI 답변 팝업 상태
    const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false); // 셀프 피드백 팝업 상태
    const [activeAudio, setActiveAudio] = useState(null);

    // 별표 및 안내 문구 표시 상태 관리
    const [showGuide, setShowGuide] = useState(true);
    const [hasFetchedData, setHasFetchedData] = useState(false);

    const {
        isNewReport,
        analysisText,
        setAnalysisText,
        setIsNewReport,
        setFirstDate,
        setLastDate,
    } = useContext(NotificationContext);

    useEffect(() => {
        if (hasFetchedData) return;

        const getFeedbackData = async () => {
            const answerId = localStorage.getItem("answerId");
            try {
                const response = await instance.get(
                    `${SPRING_API_URL}/feedbacks?answerId=${answerId}`
                );
                if (response.data.isSuccess) {
                    setUserAudioUrl(response.data.result.beforeAudioLink);
                    setAiAudioUrl(response.data.result.afterAudioLink);
                    setUserScript(response.data.result.beforeScript);
                    setAiScript(response.data.result.afterScript);
                    setFeedback(response.data.result.feedbackText);
                    console.log("유저 답변에 대한 피드백 데이터 받아오기 성공");
                } else {
                    console.error("데이터 api 오류");
                }
            } catch (error) {
                console.error("데이터 받아오기 실패");
            }
        };

        const getAiResponse = async () => {
            const answerId = localStorage.getItem("answerId");
            try {
                const response = await instance.get(
                    `${SPRING_API_URL}/insights?answerId=${answerId}`
                );
                if (response.data.isSuccess) {
                    setAiResponse(response.data.result.insight);
                    console.log("서버에서 인사이트 받아오기 성공");
                } else {
                    console.error("서버에서 인사이트 받아오기 api 오류");
                }
            } catch (error) {
                console.error("서버에서 인사이트 받아오기 실패");
            }
        };

        const getAnalysisReport = async () => {
            try {
                const response = await instance.get(`${SPRING_API_URL}/analysis`);
                if (response.data.isSuccess) {
                    if (response.data.code === "STATISTICS2003") {
                        const newAnalysisText = response.data.result.analysisText;
                        const firstDate = response.data.result.firstDate;
                        const lastDate = response.data.result.lastDate;
                        if (newAnalysisText !== analysisText) {
                            setIsNewReport(true);
                            setAnalysisText(newAnalysisText);
                            setFirstDate(firstDate);
                            setLastDate(lastDate);
                        }
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
        }

        const saveAnalysis = async () => {
            try {
                const response = await instance.post(`${SPRING_API_URL}/analysis`);
                if (response.data.isSuccess) {
                    if (response.data.code === "STATISTICS2002") {
                        getAnalysisReport();
                        console.log("유저 7일 분석 레포트 생성 완료");
                    } else {
                        console.error("유저 7일 분석 레포트 생성 실패");
                    }
                } else {
                    console.error("서버 에러");
                }
            } catch (error) {
                console.error("유저 7일 분석 레포트 생성 실패");
            }
        }

        const getCanSaveAnalysis = async () => {
            try {
                const response = await instance.get(`${SPRING_API_URL}/analysis/available`);
                if (response.data.isSuccess) {
                    if (response.data.code === "STATISTICS2004" && response.data.result.canSaveAnalysis) {
                        saveAnalysis();
                    } else {
                        console.error("유저의 7일 레포트 생성 가능 여부 받아오기 서버 오류");
                    }
                } else {
                    console.error("서버 에러");
                }
            } catch (error) {
                console.error("유저의 7일 레포트 생성 가능 여부 받아오기 실패");
            }
        }


        getAiResponse();
        getFeedbackData();
        getCanSaveAnalysis(); // 분석 가능해? -> 가능하면 분석하고 분석을 새로 만들었으면 최근 리포트 가져오기
        setHasFetchedData(true);

    }, [analysisText, setAnalysisText, setFirstDate, setLastDate, setIsNewReport, hasFetchedData]);

    useEffect(() => {
        // 5초 후에 강조 문구 제거
        const timer = setTimeout(() => {
            setShowGuide(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const playAudioWithGauge = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
        setActiveAudio(audioUrl);
        audio.onended = () => setActiveAudio(null);
    };

    const handleCloseNotification = () => {
        setIsNewReport(false);
    }

    return (
        <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
            {isNewReport && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="relative flex flex-col items-center text-xl font-semibold text-center text-white font-paperlogy-heading">
                        <div className="mt-6 mb-6 animate-floating">
                            <p>
                                잠깐! <br/>
                                새로운 분석 리포트가 도착했습니다! <br/>
                                상단의 종 아이콘을 눌러 확인해주세요!
                            </p>
                        </div>
                        <button
                            className="px-8 py-4 mt-4 text-lg font-semibold text-black rounded-full bg-primary-20"
                            onClick={() => handleCloseNotification()}
                        >
                            확인하러 가기
                        </button>
                    </div>
                </div>
            )}
            <div className="fixed top-0 z-20 w-full">
                <Header/>
            </div>
            {/* 컨텐츠 */}
            <div className="flex-1 w-full max-w-[500px] mx-auto pt-24 pb-24 overflow-y-auto px-4 space-y-6 bg-white">
                <div className="flex justify-center space-x-8">
                    {/* AI 답변 보기 버튼 */}
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="flex-1 py-3 text-lg font-semibold text-white rounded-full max-w-36 bg-primary-50"
                    >
                        AI 답변 보기
                    </button>

                    {/* 셀프 피드백 체크 버튼 */}
                    <button
                        onClick={() => setIsFeedbackPopupOpen(true)}
                        className="flex-1 py-3 text-lg font-semibold text-white rounded-full max-w-36 bg-primary-50"
                    >
                        셀프 피드백
                    </button>
                </div>

                {/* 강조 문구 */}
                {showGuide && (
                    <div
                        className="absolute flex items-center space-x-1 transform -translate-x-1/2 left-[calc(50%+17px)] top-12 animate-bounce">
                        <FaStar className="text-yellow-400"/>
                        <p className="text-sm font-semibold">먼저 진행해주세요</p>
                        <FaStar className="text-yellow-400"/>
                    </div>
                )}

                {/* 상단 메시지 */}
                <div
                    className="relative flex flex-col items-center justify-center w-full px-4 py-2 rounded-md bg-grayscale-10">
                    <p className="text-base font-paperlogy-title font-regular">
                        오늘 하루도 복숭아멘토 챌린지 성공!
                    </p>
                </div>

                {/* 사용자 스크립트 */}
                <ScriptBox
                    image={userImage}
                    title="나의 스크립트"
                    description="추임새, 침묵시간 등이 포함됩니다."
                    content={userScript}
                    audioUrl={userAudioUrl}
                    isOpen={isUserScriptOpen}
                    toggleOpen={() => setIsUserScriptOpen(!isUserScriptOpen)}
                    playAudioWithGauge={playAudioWithGauge}
                    activeAudio={activeAudio}
                    duration={60}
                />

                {/* AI 수정 스크립트 */}
                <ScriptBox
                    image={aiImage}
                    title="AI가 수정한 스크립트"
                    description="위 스크립트를 AI가 직접 수정했어요."
                    content={aiScript}
                    audioUrl={aiAudioUrl}
                    isOpen={isAiScriptOpen}
                    toggleOpen={() => setIsAiScriptOpen(!isAiScriptOpen)}
                    playAudioWithGauge={playAudioWithGauge}
                    activeAudio={activeAudio}
                    duration={60}
                />

                {/* AI 피드백 */}
                <ScriptBox
                    image={feedbackImage}
                    title="AI 피드백"
                    description="복숭아멘토의 상세한 피드백을 확인하세요!"
                    content={feedback}
                    isOpen={isFeedbackOpen}
                    toggleOpen={() => setIsFeedbackOpen(!isFeedbackOpen)}
                />
            </div>

            {/* NavBar */}
            <div className="fixed bottom-0 z-20 w-full">
                <NavBar/>
            </div>

            {/* AI 답변 팝업 */}
            <AISpeechPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                response={aiResponse}
            />

            {/* 셀프 피드백 팝업 */}
            <SelfFeedbackPopup
                isOpen={isFeedbackPopupOpen}
                onClose={() => setIsFeedbackPopupOpen(false)}
            />
        </div>
    );
};

export default RecordScript;