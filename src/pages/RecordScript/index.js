import React, {useEffect, useState} from "react";
import {FaVolumeUp} from "react-icons/fa";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import instance from "../../axios/TokenInterceptor";
import {SPRING_API_URL} from "../../constants/api";

const RecordScript = ({selectedDate}) => {

    const [userAudioUrl, setUserAudioUrl] = useState("");
    const [aiAudioUrl, setAiAudioUrl] = useState("");
    const [userScript, setUserScript] = useState("");
    const [aiScript, setAiScript] = useState("");
    const [feedback, setFeedback] = useState("");

    const [isUserScriptOpen, setIsUserScriptOpen] = useState(false);
    const [isAiScriptOpen, setIsAiScriptOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
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

        getFeedbackData();
    }, []);

    const playAudio = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const toggleUserScript = () => setIsUserScriptOpen(!isUserScriptOpen);
    const toggleAiScript = () => setIsAiScriptOpen(!isAiScriptOpen);
    const toggleFeedback = () => setIsFeedbackOpen(!isFeedbackOpen);

    return (
        <div className="flex flex-col items-center min-h-screen max-w-[500px] w-full overflow-y-auto bg-[#f9f9f9]">
            <Header/>

            <main
                className="flex flex-col items-center flex-1 w-full max-h-screen p-4 mt-4 mb-16 space-y-6 overflow-y-auto">
                {/* 사용자 스피치 스크립트 */}
                <div
                    className="relative w-full max-w-md p-4 bg-white border rounded shadow cursor-pointer border-grayscale-30"
                    onClick={toggleUserScript}
                    style={{
                        height: isUserScriptOpen ? "auto" : "4rem",
                        transition: "height 0.3s ease",
                    }}
                >
                    <h2 className="text-base font-semibold">개인 스크립트</h2>
                    {isUserScriptOpen && (
                        <p className="mt-2 text-grayscale-90">{userScript}</p>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            playAudio(userAudioUrl);
                        }}
                        className="absolute text-xl top-4 right-4"
                    >
                        <FaVolumeUp/>
                    </button>
                </div>

                {/* AI 수정 스피치 스크립트 */}
                <div
                    className="relative w-full max-w-md p-4 bg-white border rounded shadow cursor-pointer border-grayscale-30"
                    onClick={toggleAiScript}
                    style={{
                        height: isAiScriptOpen ? "auto" : "4rem",
                        transition: "height 0.3s ease",
                    }}
                >
                    <h2 className="text-base font-semibold">AI가 수정한 스크립트</h2>
                    {isAiScriptOpen && (
                        <p className="mt-2 text-grayscale-90">{aiScript}</p>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            playAudio(aiAudioUrl);
                        }}
                        className="absolute text-xl top-4 right-4"
                    >
                        <FaVolumeUp/>
                    </button>
                </div>

                {/* AI 피드백 */}
                <div
                    className="relative w-full max-w-md p-4 bg-white border rounded shadow cursor-pointer border-grayscale-30"
                    onClick={toggleFeedback}
                    style={{
                        height: isFeedbackOpen ? "auto" : "4rem",
                        transition: "height 0.3s ease",
                    }}
                >
                    <h2 className="text-base font-semibold">AI 피드백</h2>
                    {isFeedbackOpen && (
                        <p className="mt-2 text-grayscale-90">{feedback}</p>
                    )}
                </div>
            </main>

            <NavBar/>
        </div>
    );
};

export default RecordScript;
