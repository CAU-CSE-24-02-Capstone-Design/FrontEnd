import React from "react";

const SelfFeedback = ({ selfFeedback }) => {
  const formatContent = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="w-[80%] px-4 py-3 bg-grayscale-05 border-2 rounded-lg border-grayscale-10">
      <div class="mb-2 text-lg font-bold text-center font-paperlogy-title text-grayscale-100">
        ✉️ 셀프 피드백 도착 ✉️
      </div>
      <div className="p-4 text-lg font-medium text-center font-paperlogy-title text-grayscale-190">
        {formatContent(selfFeedback)}
      </div>
    </div>
  );
};

export default SelfFeedback;
