import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineBarChart,
} from "react-icons/ai";
import instance from "../axios/TokenInterceptor";
import { SPRING_API_URL } from "../constants/api";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 페이지 확인

  const handleMainButton = async () => {
    let isCompleteSpeech = false;
    let selfFeedback = null;

    try {
      const response = await instance.get(
        `${SPRING_API_URL}/answers/completions`
      );
      if (response.data.isSuccess) {
        if (
          response.data.code === "ANSWER4001" ||
          response.data.code === "USER4002" ||
          response.data.code === "ACCESSTOKEN4002"
        ) {
          console.error("오늘 답변 했는 지 여부 받아오기 API 서버 에러");
        } else {
          isCompleteSpeech = response.data.result.answerExists || false;
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
          selfFeedback = response.data.result.feedback || null;
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
      const response = await instance.get(`${SPRING_API_URL}/statistics`);
      if (response.data.isSuccess) {
        if (response.data.code === "STATISTICS2001") {
          statisticsData = response.data.result.map((item) => ({
            day: item.day, // 날짜 그대로 사용
            추임새: item.gantourCount, // 'gantourCount' 값을 '추임새'로 변환
            침묵시간: item.silentTime, // 'silentTime' 값을 '침묵시간'으로 변환
          }));
        } else if (response.data.code === "STATISTICS4001") {
          console.error("통계 데이터 받아오기 실패");
        }
      }
    } catch (error) {
      console.error("통계 데이터 받아오기 실패");
    }

    navigate(
      `/statistics?statisticsData=${encodeURIComponent(
        JSON.stringify(statisticsData)
      )}`
    );
  };

  // 현재 페이지를 기반으로 버튼 스타일링 설정
  const isActive = (path) =>
    location.pathname === path
      ? "text-primary-50" // 활성화
      : "text-grayscale-90"; // 비활성화

  return (
    <nav className="bottom-0 left-0 w-full max-w-[500px] mx-auto flex justify-around items-center border-t border-slate-500 py-3 bg-white">
      {/* 캘린더 버튼 */}
      <button
        onClick={() => navigate("/calendar")}
        className="flex flex-col items-center"
      >
        <AiOutlineCalendar
          size={24}
          className={`mb-1 ${isActive("/calendar")}`}
        />
        <span
          className={`text-base font-paperlogy-title ${isActive("/calendar")}`}
        >
          캘린더
        </span>
      </button>

      {/* 홈 버튼 */}
      <button onClick={handleMainButton} className="flex flex-col items-center">
        <AiOutlineHome size={24} className={`mb-1 ${isActive("/main")}`} />
        <span className={`text-base font-paperlogy-title ${isActive("/main")}`}>
          홈
        </span>
      </button>

      {/* 통계 버튼 */}
      <button
        onClick={handleStatisticsButton}
        className="flex flex-col items-center"
      >
        <AiOutlineBarChart
          size={24}
          className={`mb-1 ${isActive("/statistics")}`}
        />
        <span
          className={`text-base font-paperlogy-title ${isActive(
            "/statistics"
          )}`}
        >
          통계
        </span>
      </button>
    </nav>
  );
};

export default NavBar;
