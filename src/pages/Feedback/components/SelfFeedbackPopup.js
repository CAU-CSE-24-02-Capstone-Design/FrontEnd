import React, {useEffect, useState} from "react";
import {FaStar} from "react-icons/fa";
import instance from "../../../axios/TokenInterceptor";
import {SPRING_API_URL} from "../../../constants/api";

const SelfFeedbackPopup = ({isOpen, onClose}) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const sendSelfFeedbackEvaluation = async () => {
            const answerId = localStorage.getItem("answerId");
            try {
                const response = await instance.get(`${SPRING_API_URL}/answers/evaluations?answerId=${answerId}`);
                if (response.data.isSuccess) {
                    setRating(response.data.result.evaluation);
                    console.log("셀프 피드백 평가 점수 불러오기 성공");
                } else {
                    console.error("셀프 피드백 평가 점수 불러오기 api 오류");
                }
            } catch (error) {
                console.error("셀프 피드백 평가 점수 불러오기 실패");
            }
        }

        sendSelfFeedbackEvaluation();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[320px] text-center space-y-4">
                <h2 className="mb-4 text-xl font-bold">평가</h2>
                <p className="text-sm">
                    1분 스피치에 대한 스스로의 평가
                </p>
                <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            size={32}
                            className={index < rating ? "text-yellow-400" : "text-gray-300"}
                            style={{cursor: "pointer"}}
                        />
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-white rounded bg-primary-50"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default SelfFeedbackPopup;
