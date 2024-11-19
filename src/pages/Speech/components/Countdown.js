import React, { useEffect, useState } from "react";

const Countdown = ({ onCountdownComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft === 0) {
      onCountdownComplete(); // 카운트다운이 완료되면 부모 컴포넌트에 알림
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onCountdownComplete]);

  return (
    <div className="mt-10 text-xl font-bold text-primary-50 font-paperlogy-title">
      {secondsLeft}초 후 시작합니다!
    </div>
  );
};

export default Countdown;
