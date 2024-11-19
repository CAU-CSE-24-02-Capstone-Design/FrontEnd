import React, {useEffect, useState} from "react";
import Lottie from "react-lottie-player";
import mainAnimations from "../../components/animations/mainAnimation.json";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import {SPRING_API_URL} from "../../constants/api";
import instance from "../../axios/TokenInterceptor";
import {useLocation, useNavigate} from "react-router-dom";
import SelfFeedback from "./components/SelfFeedback";

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selfFeedback = searchParams.get("selfFeedback");
    const isCompleteSpeech = searchParams.get("isCompleteSpeech") === "true";

    const [answerId, setAnswerId] = useState("");
    const [questionText, setQuestionText] = useState("");

    useEffect(() => {
        if (answerId) {
            localStorage.setItem("answerId", answerId);
        }
    }, [answerId]);


    const handleQuestionClick = async () => {
        try {
            const response = await instance.get(`${SPRING_API_URL}/questions`);
            if (response.data.isSuccess) {
                setQuestionText(response.data.result.questionDescription);
                setAnswerId(response.data.result.answerId);
                console.log("질문 받아오기 성공");

                navigate(`/speech?answerId=${answerId}&questionText=${questionText}`);
            } else {
                console.error("질문 받아오기 오류");
                console.log(response.data.code);
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("질문 받아오기 실패");
        }
    };

    return (
        <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-white">
            <Header/>
            <main className="flex flex-col items-center justify-center flex-grow px-4">

                {/* 이전 스피치에서의 셀프 피드백 */}
                {selfFeedback && <SelfFeedback selfFeedback={selfFeedback}/>}

                {/* "오늘의 질문" 버튼 또는 완료 메시지 버튼 */}
                {isCompleteSpeech ? (
                    <button
                        className="px-6 py-4 mt-6 text-lg text-white rounded bg-gray-400 font-paperlogy-title"
                        disabled
                    >
                        1분 스피치를 이미 완료했습니다
                    </button>
                ) : (
                    <button
                        onClick={handleQuestionClick}
                        className="px-6 py-4 mt-6 text-lg text-white rounded bg-primary-50 font-paperlogy-title"
                    >
                        오늘의 질문
                    </button>
                )}

                {/* 메인 시작 페이지 돋보기 애니메이션 */}
                <div className="w-3/4 mt-14">
                    <Lottie
                        loop
                        animationData={mainAnimations}
                        play
                        style={{width: "100%", height: "auto"}}
                    />
                </div>

            </main>
            <NavBar/>
        </div>
    );
};

export default Main;
