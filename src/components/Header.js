import React from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios/TokenInterceptor";
import { SPRING_API_URL } from "../constants/api";

const Header = () => {
  const navigate = useNavigate();

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

  // Header의 오른쪽 메뉴 버튼 클릭 시 마이페이지로 이동
  const handleMyPageClick = () => {
    navigate("/mypage");
  };

  return (
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
        />
        <img
          src="/webp/mypage_menu.webp"
          alt="My Page Icon"
          className="w-8 h-8 cursor-pointer"
          onClick={handleMyPageClick}
        />
      </div>
    </header>
  );
};

export default Header;
