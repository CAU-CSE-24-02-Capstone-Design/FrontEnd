import React, {useEffect, useState} from "react";

const Countdown = ({level, onCountdownComplete}) => {
    const initialTime = level === "1" ? 10 : level === "2" || level === "3" ? 10 : 10;
    const [secondsLeft, setSecondsLeft] = useState(initialTime);

    useEffect(() => {
        if (secondsLeft === 0) {
            onCountdownComplete();
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
