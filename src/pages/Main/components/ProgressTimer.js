import React, {useEffect, useState} from "react";

const ProgressTimer = ({duration, onTimeUp}) => {
    const [progress, setProgress] = useState(100); // 초기 게이지를 100%로 설정

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setProgress((prev) => {
    //             const newProgress = prev - 100 / (duration * 60); // 1초마다 게이지 감소
    //             if (newProgress <= 0) {
    //                 clearInterval(interval);
    //                 onTimeUp();
    //                 return 0;
    //             }
    //             return newProgress;
    //         });
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, [duration, onTimeUp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - 100 / (duration * 60);
                return newProgress > 0 ? newProgress : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [duration]);

    useEffect(() => {
        if (progress <= 0) {
            onTimeUp();
        }
    }, [progress, onTimeUp]);

    return (
        <div className="w-5/6 h-6 mt-8 rounded-xl bg-grayscale-30">
            <div
                style={{width: `${progress}%`}}
                className="h-full duration-1000 ease-linear rounded-xl bg-primary-50 transition-width"
            />
        </div>
    );
};

export default ProgressTimer;
