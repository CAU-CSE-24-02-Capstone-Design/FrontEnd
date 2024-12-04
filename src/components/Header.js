import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios/TokenInterceptor";
import { SPRING_API_URL } from "../constants/api";

const Header = () => {
  const navigate = useNavigate();
  const [analysisText, setAnalysisText] = useState("HIHI\nHIHI");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetReport = async () => {
    try {
      setIsModalOpen(true);
      const response = await instance.get(`${SPRING_API_URL}/analysis`);
      if (response.data.isSuccess) {
        if (response.data.code === "STATISTICS2003") {
          if (response.data.result.analysisText !== "") {
            setAnalysisText(response.data.result.analysisText);
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
  };

  // Header의 복숭아멘토 텍스트 클릭 시 메인 페이지로 이동
  const handleLogoClick = async () => {
    let isCompleteSpeech = false;
    let selfFeedback = null;

    try {
      const response = await instance.get(
        `${SPRING_API_URL}/feedbacks/completions`
      );
      if (response.data.isSuccess) {
        if (
          response.data.code === "USER4002" ||
          response.data.code === "ACCESSTOKEN4002"
        ) {
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

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  // Header의 오른쪽 메뉴 버튼 클릭 시 마이페이지로 이동
  const handleMyPageClick = () => {
    navigate("/mypage");
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-primary-50 w-full max-w-[500px] mx-auto">
        <h1
          className="text-3xl font-bold text-white cursor-pointer font-paperlogy-heading"
          onClick={handleLogoClick}
        >
          복숭아멘토
        </h1>
        <div className="flex items-center gap-3">
          <img
            src="/images/notification.svg"
            alt="Notification Icon"
            className="cursor-pointer w-7 h-7"
            onClick={handleGetReport}
          />
          <img
            src="/webp/mypage_menu.webp"
            alt="My Page Icon"
            className="w-8 h-8 cursor-pointer"
            onClick={handleMyPageClick}
          />
        </div>
      </header>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">일주일 리포트 분석</h2>
            <p className="mb-4">
              <pre className="whitespace-pre-wrap">{analysisText}</pre>
            </p>
            <button
              className="px-4 py-2 text-white rounded bg-primary-50 hover:bg-primary-60"
              onClick={handleCloseModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
