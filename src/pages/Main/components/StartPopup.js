import React from "react";

const StartPopup = ({ selfFeedback, onClose, onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[85%] max-w-[400px] bg-white rounded-lg shadow-lg p-4">
        <h2 className="mb-4 text-lg font-bold text-center text-grayscale-100">
          ✉️ 셀프 피드백 도착 ✉️
        </h2>
        {/* 셀프 피드백 내용 */}
        <div>
          <div className="p-4 text-lg font-medium text-center text-grayscale-100">
            {selfFeedback}
          </div>
        </div>
        <p className="py-4 text-center font-paperlogy-title">
          시작 버튼 클릭 후 10초 뒤 스피치가 시작됩니다!
        </p>
        {/* 버튼 */}
        <div className="flex justify-between font-paperlogy-title">
          <button
            className="px-4 py-2 text-black rounded-xl bg-grayscale-20 hover:bg-grayscale-30"
            onClick={onClose}
          >
            이전
          </button>
          <button
            className="px-4 py-2 text-white rounded-xl bg-primary-40 hover:bg-primary-50"
            onClick={onStart}
          >
            시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPopup;
