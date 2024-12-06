import React, {useRef, useState} from "react";
import {FaPause, FaPlay} from "react-icons/fa";

const ScriptBox = ({
                       image,
                       title,
                       description,
                       content,
                       audioUrl,
                       isOpen,
                       toggleOpen,
                   }) => {
    const audioRef = useRef(null); // 오디오 엘리먼트 참조
    const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
    const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간
    const [duration, setDuration] = useState(0); // 오디오 길이

    const togglePlayPause = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const formatContent = (text) => {
        return text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br/>
            </React.Fragment>
        ));
    };

    const beforeScriptFormatContent = (text) => {
        const parseContent = (line) => {
            // 단어 단위로 분리하여 처리
            const words = line.split(" ");
            return words.map((word, index) => {
                // 추임새를 포함한 단어 처리
                if (word.match(/^[^\s]+?\(추임새\),?$/)) {
                    const cleanWord = word.replace(",", ""); // 쉼표 제거
                    return (
                        <span key={index} style={{backgroundColor: "yellow", padding: "0 2px", marginRight: "4px"}}>
                        {cleanWord}
                    </span>
                    );
                }
                // 침묵 시간 처리
                else if (word.match(/^\(\d+(\.\d+)?초\.\.\),?$/)) {
                    const cleanWord = word.replace(",", ""); // 쉼표 제거
                    return (
                        <span key={index} style={{backgroundColor: "lightgreen", padding: "0 2px", marginRight: "4px"}}>
                        {cleanWord}
                    </span>
                    );
                }
                // 일반 단어 처리
                else {
                    return <React.Fragment key={index}>{word} </React.Fragment>;
                }
            });
        };
        return text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {parseContent(line)}
                <br/>
            </React.Fragment>
        ));
    };

    return (
        <div
            className="relative flex flex-col w-full p-4 transition-all bg-white border rounded-lg shadow cursor-pointer border-grayscale-40 hover:shadow-md"
            onClick={toggleOpen}
        >
            {/* 상단 이미지, 텍스트, 오디오 컨트롤 */}
            <div className="flex items-center gap-2">
                {/* 이미지 */}
                <img src={image} alt={title} className="flex-shrink-0 w-12 h-12"/>

                {/* 텍스트 및 오디오 */}
                <div className="flex-1">
                    {/* 텍스트 라인 */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-semibold break-words">{title}</h2>
                        </div>

                        {/* 오디오 재생 컨트롤 */}
                        {audioUrl && (
                            <div
                                className="flex items-center flex-shrink-0 ml-2 space-x-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                />

                                {/* 시작/중지 버튼 */}
                                <button
                                    onClick={togglePlayPause}
                                    className="text-md text-primary-50"
                                >
                                    {isPlaying ? <FaPause/> : <FaPlay/>}
                                </button>

                                {/* 진행 게이지바 */}
                                <div className="relative w-10 h-1 rounded-full bg-grayscale-20">
                                    <div
                                        style={{
                                            width: `${(currentTime / duration) * 100 || 0}%`,
                                        }}
                                        className="h-full transition-all rounded-full bg-primary-50"
                                    />
                                </div>

                                {/* 오디오 길이 */}
                                <span className="text-xs text-grayscale-80 whitespace-nowrap">
                  {formatTime(duration - currentTime)}
                </span>
                            </div>
                        )}
                    </div>

                    {/* 설명 텍스트 */}
                    <p className="mt-1 text-sm break-words whitespace-normal text-grayscale-100">
                        {description}
                    </p>
                </div>
            </div>

            {/* 드롭다운 텍스트 */}
            {isOpen && (
                <div className="mt-3 text-sm text-justify transition-all duration-300 ease-in-out text-grayscale-90">
                    {title === "AI 피드백" ? formatContent(content) : beforeScriptFormatContent(content)}
                </div>
            )}
        </div>
    );
};

export default ScriptBox;
