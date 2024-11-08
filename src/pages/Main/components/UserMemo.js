import React, { useState } from "react";

const UserMemo = () => {
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    console.log("사용자 개인 평가 메모 내용 제출:", memo);
    // 로직 추가
  };

  return (
    <div className="w-full p-3 mt-8 rounded-lg shadow bg-blue-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold">나만의 메모장</h3>
        <button
          onClick={handleSubmit}
          className="px-4 py-1 text-sm font-semibold text-black rounded bg-primary-20 hover:bg-primary-30"
        >
          제출
        </button>
      </div>
      <textarea
        className="w-full h-24 p-2 text-sm border border-gray-300 rounded resize-none"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="녹음 내용을 다시 들어보며 스스로 평가해보세요! 해당 내용은 다음 피드백에 반영됩니다 :)"
      />
    </div>
  );
};

export default UserMemo;
