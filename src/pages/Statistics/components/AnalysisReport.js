import React, { useState } from "react";

const AnalysisReport = ({ analysisText }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {analysisText && (
                <div className="w-full p-4 text-center mt-4 bg-primary-50 text-white rounded-lg">
                    <button
                        className="mb-2 font-semibold"
                        onClick={openModal}
                    >
                        일주일 분석 리포트 도착!
                    </button>
                </div>
            )}

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
                        {/* 닫기 버튼 */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">일주일 분석 리포트</h2>
                            <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={closeModal}
                            >
                                ✖
                            </button>
                        </div>
                        {/* 리포트 내용 */}
                        <div
                            className="max-h-64 overflow-y-auto"
                            style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}
                        >
                            {analysisText}
                        </div>
                        {/* 닫기 버튼 아래 */}
                        <div className="mt-4 text-right">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={closeModal}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AnalysisReport;