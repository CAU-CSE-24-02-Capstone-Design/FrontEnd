import React, {useCallback, useEffect, useRef, useState} from "react";
import {getWaveBlob} from "webm-to-wav-converter";
import {FASTAPI_API_URL, SPRING_API_URL} from "../../../constants/api";
import instance from "../../../axios/TokenInterceptor";

const Record = ({
                    setAudioUrl,
                    isRecording,
                    onRec,
                    setOnRec,
                    answerId,
                    questionText,
                    onResponse,
                    setInsightComplete,
                    setAnalysisComplete,
                    handleProgressTimeUp,
                    handleStopRecording,
                }) => {
    const [stream, setStream] = useState(null); // 마이크에서 가져온 오디오 스트림을 저장
    const [media, setMedia] = useState(null); // MediaRecorder 객체를 저장하여 녹음을 관리
    const audioContextRef = useRef(null); // AudioContext 참조
    const sourceRef = useRef(null); // MediaStreamSource 참조

    const getFeedback = useCallback(async () => {
        try {
            const response = await instance.post(
                `${SPRING_API_URL}/feedbacks?answerId=${answerId}`
            );
            if (response.data.isSuccess) {
                setAnalysisComplete(true);
                console.log("유저 답변에 대한 피드백 데이터 생성하기 성공");
            } else {
                console.error("유저 답변에 대한 피드백 데이터 생성하기 api 오류");
            }
        } catch (error) {
            console.error("유저 답변에 대한 피드백 데이터 생성하기 실패");
        }
    }, [answerId, setAnalysisComplete]);

    const sendAudioFile = useCallback(async (sound) => {
        try {
            const formData = new FormData();
            formData.append("file", sound);
            formData.append("answerId", parseInt(answerId, 10));
            formData.append("question", questionText);
            const response = await instance.post(
                `${FASTAPI_API_URL}/records/insights`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            onResponse(response.data.insight);
            setInsightComplete(true);
            getFeedback();
            console.log("AI 인사이트 받아오기 성공");
        } catch (error) {
            console.error("인사이트 받아오기 실패");
        }
    }, [answerId, questionText, onResponse, getFeedback, setInsightComplete]);

    const onSubmitAudioFile = useCallback(async (audioUrl) => {
        if (audioUrl) {
            const sound = new File([audioUrl], "soundBlob.wav", {
                lastModified: new Date().getTime(),
                type: "audio/wave",
            });
            setAudioUrl(URL.createObjectURL(sound)); // 변환된 URL 설정
            await sendAudioFile(sound);
        }
    }, [sendAudioFile, setAudioUrl]);

    const stopRecording = useCallback((mediaRecorder, source) => {
        mediaRecorder.ondataavailable = async (e) => {
            if (e.data && e.data.size > 0) {
                const wavBlob = await getWaveBlob(e.data, true);
                setOnRec(false);
                await onSubmitAudioFile(wavBlob);
            }
        };

        stream.getAudioTracks().forEach((track) => track.stop());
        mediaRecorder.stop();
        source.disconnect();

        // AudioContext가 열려있는지 확인 후 닫기
        if (audioContextRef.current) {
            audioContextRef.current.close().then(() => {
                audioContextRef.current = null; // AudioContext를 닫은 후 null로 설정
                setOnRec(false);
            });
        }
    }, [stream, setOnRec, onSubmitAudioFile]);

    // 녹음 시작
    const onRecAudio = useCallback(async () => {
        if (audioContextRef.current) {
            // AudioContext가 이미 존재하면 재사용
            console.log("AudioContext already exists, reusing.");
        } else {
            // AudioContext가 없으면 새로 생성
            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            setOnRec(true);

            const source = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;

            await audioContextRef.current.audioWorklet.addModule("processor.js");
            const workletNode = new AudioWorkletNode(
                audioContextRef.current,
                "worklet-processor"
            );
            source.connect(workletNode).connect(audioContextRef.current.destination);


        } catch (err) {
            console.error("Error accessing audio stream:", err);
        }
    }, [setOnRec]);

    // 녹음 중지
    const offRecAudio = useCallback(() => {
        if (!onRec) return;
        handleProgressTimeUp();
        handleStopRecording();
        stopRecording(media, sourceRef.current);
    }, [onRec, media, stopRecording, handleProgressTimeUp, handleStopRecording]);


    useEffect(() => {
        if (!onRec && isRecording) {
            onRecAudio();
        } else if (onRec && !isRecording) {
            offRecAudio();
        }
    }, [onRec, isRecording, onRecAudio, offRecAudio])

    return (
        <>
            <button
                onClick={offRecAudio}
                className="px-8 py-3 mt-10 text-lg font-semibold text-white rounded-full bg-primary-50"
            >
                녹음 완료
            </button>
        </>
    );
};

export default Record;