import React from "react";

const SelfFeedback = ({ selfFeedback }) => {
    return (
        <div className="p-6 bg-white border-2 rounded-lg shadow-md border-primary-40">
            <div
                className="p-4 text-lg font-medium text-center whitespace-pre-line font-paperlogy-title text-grayscale-100">
                {selfFeedback
                    ? selfFeedback
                    : "이전 스피치에 대해 스스로 작성한 평가가 없습니다."}
            </div>
        </div>
    );
};

export default SelfFeedback;