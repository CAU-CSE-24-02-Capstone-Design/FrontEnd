import React from "react";

const AISpeechPopup = ({ isOpen, onClose, response }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-5/6 max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">AI 답변</h2>

        {response && response.length > 0 ? (
          response.map((item, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-300 rounded-lg bg-gray-50"
            >
              {/* AI 답변 번호 */}
              <h3 className="mb-2 text-lg font-bold text-primary-50">
                답변 {index + 1}
              </h3>
              {/* AI의 답변 내용 */}
              <p className="text-gray-700">{item}</p>
            </div>
          ))
        ) : (
          // AI 답변이 없을 때 표시되는 메시지
          <p>AI가 새로운 답변을 생성하는 중입니다!</p>
        )}

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 text-white rounded bg-primary-50 hover:bg-primary-60"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AISpeechPopup;
