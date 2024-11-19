import React from "react";

const AISpeechPopup = ({ isOpen, onClose, response }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col w-5/6 max-w-md bg-white rounded-lg">
        <div className="sticky top-0 z-10 p-4 bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold">AI 답변</h2>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>
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
        </div>

        {/* 닫기 버튼 */}
        <div className="sticky bottom-0 p-4 bg-white rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white rounded bg-primary-50 hover:bg-primary-60"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISpeechPopup;
