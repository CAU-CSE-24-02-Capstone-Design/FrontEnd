import React, {useState} from "react";
import instance from "../../../axios/TokenInterceptor";
import {SPRING_API_URL} from "../../../constants/api";

const UserMemo = () => {
    const [memo, setMemo] = useState("");

    const handleSubmit = async () => {
        try {
            const answerId = localStorage.getItem("answerId");
            const response = await instance.post(`${SPRING_API_URL}/self-feedbacks?answerId=${answerId}`,
                {feedback: memo}
            );
            if (response.data.isSuccess) {
                console.log("셀프 피드백 제출 성공");
            } else {
                console.error("셀프 피드백 제출 오류");
                console.log(response.data.code);
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("셀프 피드백 제출 실패");
        }
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
