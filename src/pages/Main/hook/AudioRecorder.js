import { useState, useRef } from "react";

const AudioRecorder = () => {
    const [stream, setStream] = useState(null); // 마이크에서 가져온 오디오 스트림을 저장
    const [media, setMedia] = useState(null); // MediaRecorder 객체를 저장하여 녹음을 관리
    const [audioUrl, setAudioUrl] = useState(null); // 녹음된 오디오 데이터를 Blob으로 저장
    const audioContextRef = useRef(null); // AudioContext 참조
    const sourceRef = useRef(null); // MediaStreamSource 참조

    return {
        stream,
        setStream,
        media,
        setMedia,
        audioUrl,
        setAudioUrl,
        audioContextRef,
        sourceRef,
    };
};

export default AudioRecorder;