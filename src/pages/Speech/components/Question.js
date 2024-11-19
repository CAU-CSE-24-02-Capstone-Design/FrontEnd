import React from "react";

const Question = ({ questionText }) => {
  return (
    <div className="p-6 bg-white border-2 rounded-lg shadow-md border-primary-40">
      <div className="p-4 text-lg font-medium text-center whitespace-pre-line font-paperlogy-title text-grayscale-100">
        {questionText}
      </div>
    </div>
  );
};

export default Question;
