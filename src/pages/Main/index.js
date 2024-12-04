import React, { useState } from "react";
import Lottie from "react-lottie-player";
import mainAnimations from "../../components/animations/mainAnimation.json";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import { SPRING_API_URL } from "../../constants/api";
import instance from "../../axios/TokenInterceptor";
import { useLocation, useNavigate } from "react-router-dom";
import SelfFeedback from "./components/SelfFeedback";
import StartPopup from "./components/StartPopup";

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selfFeedback = searchParams.get("selfFeedback");
  const feedback = selfFeedback === "null" ? null : selfFeedback; // "null" 문자열을 null로 변환
  const isCompleteSpeech = searchParams.get("isCompleteSpeech") === "true";
  const [level, setLevel] = useState(1);
  const [canStop, setCanStop] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 시작 전 셀프 피드백 팝업 상태 관리

  const handleQuestionClick = async () => {
    setIsPopupOpen(true); // 팝업 열기
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // 팝업 닫기
  };

  const handlePopupStart = async () => {
    setIsPopupOpen(false); // 팝업 닫기
    try {
      const response = await instance.get(
        `${SPRING_API_URL}/questions?level=${level}`
      );
      if (response.data.isSuccess) {
        const questionText = response.data.result.questionDescription;
        const answerId = response.data.result.answerId;
        console.log("질문 받아오기 성공");
        localStorage.setItem("answerId", answerId);
        navigate(
          `/speech?answerId=${answerId}&questionText=${questionText}&level=${level}&canStop=${canStop}`
        );
      } else {
        console.error("질문 받아오기 오류");
        console.log(response.data.code);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("질문 받아오기 실패");
    }
  };

  const getLevelMessage = () => {
    switch (level) {
      case 1:
        return "질문 확인 시간 : 10초, 스피치 시간 : 30초";
      case 2:
        return "질문 확인 시간 : 10초, 스피치 시간 : 1분";
      case 3:
        return "질문 확인 시간 : 10초, 스피치 시간 : 2분";
      default:
        return "";
    }
  };

  const buttonStyle = (buttonLevel) => {
    return level === buttonLevel
      ? "w-10 h-10 flex items-center justify-center text-white rounded-full bg-primary-40 font-paperlogy-title"
      : "w-10 h-10 flex items-center justify-center text-grayscale-90 rounded-full bg-grayscale-20 font-paperlogy-title";
  };

  return (
    <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-white">
      <Header />
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        {/* 이전 스피치에서의 셀프 피드백 */}
        {feedback && <SelfFeedback selfFeedback={feedback} />}

        {/* "오늘의 질문" 버튼 또는 완료 메시지 버튼 */}
        {isCompleteSpeech ? (
          <button
            className="px-6 py-4 mt-6 text-lg text-white bg-gray-400 rounded font-paperlogy-title"
            disabled
          >
            1분 스피치를 이미 완료했습니다
          </button>
        ) : (
          <>
            <button
              onClick={handleQuestionClick}
              className="relative px-10 py-4 mt-6 text-xl text-white transition-all duration-300 shadow-md rounded-2xl bg-primary-40 font-paperlogy-title hover:scale-110 hover:shadow-lg hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-50 active:scale-95"
            >
              오늘의 질문
              <div className="absolute inset-x-0 bottom-0 h-3 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 blur-md hover:opacity-100"></div>
            </button>
          </>
        )}

        {/* 메인 시작 페이지 돋보기 애니메이션 */}
        <div className="w-3/4 mt-8">
          <Lottie
            loop
            animationData={mainAnimations}
            play
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        {!isCompleteSpeech && (
          <>
            <p className="mt-8 text-base font-paperlogy-title text-grayscale-90">
              오늘 진행할 스피치의 난이도를 선택하세요!
            </p>
            <p className="mt-4 text-sm font-paperlogy-heading text-grayscale-90">
              {getLevelMessage()}
            </p>
            <div className="flex mt-6 space-x-4">
              <button onClick={() => setLevel(1)} className={buttonStyle(1)}>
                1
              </button>
              <button onClick={() => setLevel(2)} className={buttonStyle(2)}>
                2
              </button>
              <button onClick={() => setLevel(3)} className={buttonStyle(3)}>
                3
              </button>
              <button
                onClick={() => setCanStop(!canStop)}
                className={`px-4 py-2 text-white rounded-md ${
                  canStop ? "bg-green-500" : "bg-red-500"
                } hover:bg-opacity-80`}
              >
                {canStop ? "On" : "Off"}
              </button>
            </div>
          </>
        )}
      </main>
      <NavBar />

      {/* 시작 전 셀프 피드백을 보여주는 팝업 */}
      {isPopupOpen && (
        <StartPopup
          selfFeedback={feedback}
          onClose={handlePopupClose}
          onStart={handlePopupStart}
        />
      )}
    </div>
  );
};

export default Main;
