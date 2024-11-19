import React from "react";
import {FaVolumeUp} from "react-icons/fa";
import ProgressGauge from "./ProgressGauge";

const ScriptBox = ({
                       image,
                       title,
                       description,
                       content,
                       audioUrl,
                       isOpen,
                       toggleOpen,
                       playAudioWithGauge,
                       activeAudio,
                       duration,
                   }) => {
    return (
        <div
            className="relative flex items-center w-full max-w-md p-4 bg-white border rounded shadow cursor-pointer border-grayscale-40"
            onClick={toggleOpen}
        >
            <img src={image} alt={title} className="w-10 h-10 mr-3"/>
            <div className="flex-1">
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-1 text-xs text-grayscale-90">{description}</p>
                {isOpen && (
                    <p className="mt-2 text-grayscale-90 transition-all duration-300 ease-in-out max-h-[150px] overflow-hidden">
                        {content}
                    </p>
                )}
            </div>
            {audioUrl && (
                <div
                    className="relative flex items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            playAudioWithGauge(audioUrl);
                        }}
                        className="text-xl"
                    >
                        <FaVolumeUp/>
                    </button>
                    {activeAudio === audioUrl && <ProgressGauge duration={duration}/>}
                </div>
            )}
        </div>
    );
};

export default ScriptBox;
