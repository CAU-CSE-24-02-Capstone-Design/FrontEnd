import React, {useCallback, useEffect, useRef, useState} from "react";
import {getWaveBlob} from "webm-to-wav-converter";
import {FASTAPI_API_URL} from "../constants/api";
import instance from "../axios/TokenInterceptor";

const Record = ({isRecording, answerId, questionText, onResponse}) => {
    const [stream, setStream] = useState(null); // 마이크에서 가져온 오디오 스트림을 저장
    const [media, setMedia] = useState(null); // MediaRecorder 객체를 저장하여 녹음을 관리
    const [onRec, setOnRec] = useState(true); // 녹음 중인지 여부를 추적
    const [audioUrl, setAudioUrl] = useState(null); // 녹음된 오디오 데이터를 Blob으로 저장
    const audioContextRef = useRef(null); // AudioContext 참조
    const sourceRef = useRef(null); // MediaStreamSource 참조

    // 녹음 시작
    const onRecAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            setOnRec(false);

            const source = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;

            await audioContextRef.current.audioWorklet.addModule("processor.js");
            const workletNode = new AudioWorkletNode(
                audioContextRef.current,
                "worklet-processor"
            );
            source.connect(workletNode).connect(audioContextRef.current.destination);

            // workletNode.port.onmessage = (event) => {
            //     const {currentTime} = event.data;
            //     if (currentTime > 60) {
            //         // 1분 후 자동 정지
            //         stopRecording(mediaRecorder, source);
            //     }
            // };
        } catch (err) {
            console.error("Error accessing audio stream:", err);
        }
    }, []);

    // 녹음 중지 함수
    const offRecAudio = useCallback(() => {
        if (media && sourceRef.current) {
            stopRecording(media, sourceRef.current);
        }
    }, [media, stopRecording]);

    // 녹음 중지
    const stopRecording = useCallback(
        async (mediaRecorder, source) => {
            mediaRecorder.ondataavailable = async (e) => {
                if (e.data && e.data.size > 0) {
                    const wavBlob = await getWaveBlob(e.data, true);
                    setAudioUrl(wavBlob);
                    setOnRec(true);
                    await onSubmitAudioFile(wavBlob);
                }
            };

            stream.getAudioTracks().forEach((track) => track.stop());
            mediaRecorder.stop();
            source.disconnect();

            if (audioContextRef.current) {
                audioContextRef.current.close().then(() => {
                    audioContextRef.current = null;
                });
            }
        },
        [stream]
    );

    // 오디오 파일 생성하기
    const onSubmitAudioFile = useCallback(
        async (wavBlob) => {
            const sound = new File([wavBlob], "soundBlob.wav", {
                lastModified: new Date().getTime(),
                type: "audio/wave",
            });
            await sendAudioFile(sound);
        },
        [sendAudioFile]
    );

    // 오디오 파일 fastapi 서버로 전달하기
    const sendAudioFile = useCallback(
        async (sound) => {
            try {
                const formData = new FormData();
                formData.append("file", sound);
                formData.append("answerId", answerId);
                formData.append("question", questionText);
                const response = await instance.post(
                    `${FASTAPI_API_URL}/record/insight`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                if (response.data.isSuccess) {
                    onResponse(response.data.result.insight);
                } else {
                    console.error("인사이트 받아오기 오류:", response.data.message);
                }
            } catch (error) {
                console.error("인사이트 받아오기 실패");
            }
        },
        [answerId, questionText, onResponse]
    );

    useEffect(() => {
        if (isRecording)
            onRecAudio();
        else if (!isRecording) {
            offRecAudio();
        }
    }, [isRecording, onRecAudio, offRecAudio]);

    return (
        <>
            <button onClick={offRecAudio} disabled={onRec}>
                녹음 중지
            </button>
        </>
    );
};

export default Record;
