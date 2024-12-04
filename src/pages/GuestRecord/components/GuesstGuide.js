import React, { useState } from "react";

const GuestGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const images = [
    "/webp/guide01.webp",
    "/webp/guide02.webp",
    "/webp/guide03.webp",
    "/webp/guide04.webp",
    "/webp/guide05.webp",
    "/webp/guide06.webp",
  ];

  const isLastStep = currentStep === 7; // 가이드 마지막 단계 확인

  const commonButtonClass =
    "absolute w-12 h-12 bg-grayscale-10 rounded-full flex items-center justify-center transform -translate-y-1/2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full h-full max-w-[500px] flex items-center justify-center">
        {/* 닫기 버튼
        {currentStep < 7 && (
          <button
            onClick={onClose}
            className="absolute z-30 flex items-center justify-center rounded-full top-6 left-4"
          >
            <img
              src="/webp/close_button_white.webp"
              alt="닫기 버튼"
              className="object-contain w-6 h-6"
            />
          </button>
        )} */}

        {/* 가이드 이미지 및 마지막 닫기 페이지 */}
        {currentStep <= 6 ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={images[currentStep - 1]}
              alt={`가이드 ${currentStep}`}
              className="object-contain w-full h-auto max-h-full"
            />
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center w-full h-full bg-white">
            <p className="text-lg font-bold text-center text-grayscale-90">
              사용자 가이드가 완료되었습니다
            </p>
            <button
              onClick={onClose}
              className="px-6 py-4 mt-4 text-lg font-bold text-white rounded-full font-paperlogy-heading bg-primary-40 hover:bg-primary-50"
            >
              복숭아멘토 시작하기
            </button>
          </div>
        )}

        {/* 이전 버튼 */}
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            className={`${commonButtonClass} left-[10px] top-1/2`}
          >
            <span>&larr;</span>
          </button>
        )}

        {/* 다음 버튼 */}
        {!isLastStep && (
          <button
            onClick={handleNext}
            className={`${commonButtonClass} right-[10px] top-1/2`}
          >
            <span>&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestGuide;
