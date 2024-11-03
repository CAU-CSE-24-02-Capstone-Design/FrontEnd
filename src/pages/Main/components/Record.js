import React, {useCallback, useEffect} from "react";
import {getWaveBlob} from "webm-to-wav-converter";
import {FASTAPI_API_URL} from "../../../constants/api";
import instance from "../../../axios/TokenInterceptor";

const Record = ({
                    isRecording,
                    onRec,
                    setOnRec,
                    answerId,
                    questionText,
                    onResponse,
                    handleMovePage,
                    handleProgressTimeUp,
                    audioRecorder
                }) => {
    const {stream, setStream, media, setMedia, audioUrl, setAudioUrl, audioContextRef, sourceRef} = audioRecorder;

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
    }, [setOnRec]);

    const stopRecording = useCallback((mediaRecorder, source) => {
        mediaRecorder.ondataavailable = async (e) => {
            if (e.data && e.data.size > 0) {
                const wavBlob = await getWaveBlob(e.data, true);
                console.log("변환 데이터: ", wavBlob);

                setAudioUrl(wavBlob);
                setOnRec(false);
            }
        };

        stream.getAudioTracks().forEach((track) => track.stop());
        mediaRecorder.stop();
        source.disconnect();

        // AudioContext가 열려있는지 확인 후 닫기
        if (audioContextRef.current) {
            audioContextRef.current.close().then(() => {
                audioContextRef.current = null; // AudioContext를 닫은 후 null로 설정
                console.log("멈추는거 맞음?");
                setOnRec(false);
            });
        }
    }, [stream, setOnRec]);

    // 녹음 중지
    const offRecAudio = useCallback(() => {
        if (!onRec) return;
        handleProgressTimeUp();
        stopRecording(media, sourceRef.current);
    }, [onRec, media, stopRecording, handleProgressTimeUp]);


    const sendAudioFile = useCallback(async (sound) => {
        try {
            const formData = new FormData();
            formData.append("file", sound);
            formData.append("answerId", parseInt(answerId, 10));
            formData.append("question", questionText);
            const response = await instance.post(
                `${FASTAPI_API_URL}/record/insight`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            console.log(response.data);
            onResponse(response.data.insight);

        } catch (error) {
            console.error("인사이트 받아오기 실패");
        }
    }, [answerId, questionText, onResponse]); // 필요한 의존성 추가

    const onSubmitAudioFile = useCallback(async () => {
        if (audioUrl) {
            const sound = new File([audioUrl], "soundBlob.wav", {
                lastModified: new Date().getTime(),
                type: "audio/wave",
            });
            console.log(sound); // File 정보 출력
            handleMovePage();
            await sendAudioFile(sound);
        }
    }, [audioUrl, sendAudioFile, handleMovePage]); // sendAudioFile이 useCallback으로 래핑되었으므로 종속성 배열에 추가

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
            <button
                onClick={onSubmitAudioFile}
                className="px-8 py-3 mt-10 text-lg font-semibold text-white rounded-full bg-primary-50"
            >
                피드백 받기
            </button>
        </>
    );
};

export default Record;