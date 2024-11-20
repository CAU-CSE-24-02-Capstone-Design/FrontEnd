import React, {useRef, useState} from "react";
import {getWaveBlob} from "webm-to-wav-converter";
import {FASTAPI_API_URL} from "../../../constants/api";
import {useNavigate} from "react-router-dom";
import instance from "../../../axios/TokenInterceptor";

const GuestRecord = () => {
    const [stream, setStream] = useState(null); // 마이크에서 가져온 오디오 스트림을 저장
    const [media, setMedia] = useState(null); // MediaRecorder 객체를 저장하여 녹음을 관리
    const [isRecording, setIsRecording] = useState(false); // 녹음 중인지 여부를 추적
    const [audioUrl, setAudioUrl] = useState(null); // 녹음된 오디오 데이터를 Blob으로 저장
    const [showGuide, setShowGuide] = useState(true); // 코치마크 표시 여부
    const audioContextRef = useRef(null); // AudioContext 참조
    const sourceRef = useRef(null); // MediaStreamSource 참조
    const navigate = useNavigate();

    // 녹음 시작
    const onRecAudio = async () => {
        setShowGuide(false); // 녹음 가이드를 숨김
        if (audioContextRef.current) {
            console.log("AudioContext already exists, reusing.");
        } else {
            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            setIsRecording(true); // 녹음 시작 시 isRecording을 true로 설정

            const source = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;

            await audioContextRef.current.audioWorklet.addModule("processor.js");
            const workletNode = new AudioWorkletNode(
                audioContextRef.current,
                "worklet-processor"
            );
            source.connect(workletNode).connect(audioContextRef.current.destination);

            workletNode.port.onmessage = (event) => {
                const {currentTime} = event.data;
                if (currentTime > 60) {
                    stopRecording(mediaRecorder, source);
                }
            };
        } catch (err) {
            console.error("Error accessing audio stream:", err);
        }
    };

    // 녹음 중지
    const offRecAudio = () => {
        stopRecording(media, sourceRef.current);
    };

    const stopRecording = (mediaRecorder, source) => {
        mediaRecorder.ondataavailable = async (e) => {
            if (e.data && e.data.size > 0) {
                const wavBlob = await getWaveBlob(e.data, true);
                const url = URL.createObjectURL(wavBlob); // Blob을 URL로 변환
                setAudioUrl(url); // audioUrl 상태에 설정
                setIsRecording(false); // 녹음이 끝나면 isRecording을 false로 설정
                sendAudioFile(wavBlob); // 녹음된 오디오 파일 전송
            }
        };

        stream.getAudioTracks().forEach((track) => track.stop());
        mediaRecorder.stop();
        source.disconnect();

        if (audioContextRef.current) {
            audioContextRef.current.close().then(() => {
                audioContextRef.current = null; // AudioContext를 닫은 후 null로 설정
            });
        }
    };

    // 오디오 파일 fastapi 서버로 전달하기
    const sendAudioFile = async (sound) => {
        try {
            const formData = new FormData();
            formData.append("file", sound);
            await instance.post(`${FASTAPI_API_URL}/records/voices`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("사용자 목소리 녹음 파일 전송 성공");
        } catch (error) {
            console.error("사용자 목소리 녹음 파일 전송 실패");
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            {showGuide && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="relative flex flex-col items-center text-xl font-semibold text-center text-white font-paperlogy-heading">
                        {/* 스크립트 안내 텍스트 */}
                        <div className="mt-6 mb-6 animate-floating">
                            <p>▼ 아래 스크립트를 읽어주세요 ▼</p>
                            <div className="arrow-up"></div>
                        </div>

                        {/* 녹음 버튼 안내 텍스트 */}
                        <div className="mt-80">
                            <p>녹음 버튼을 클릭하면 시작합니다!</p>
                            <div className="arrow-down"></div>
                        </div>

                        <button
                            className="px-8 py-4 mt-4 text-lg font-semibold text-black rounded-full bg-primary-20"
                            onClick={() => setShowGuide(false)}
                        >
                            녹음 가이드 닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 녹음 버튼 */}
            {!audioUrl && !isRecording && (
                <button
                    onClick={onRecAudio}
                    className="px-6 py-3 mt-10 text-base font-semibold text-white rounded-full bg-primary-50"
                >
                    녹음 시작
                </button>
            )}

            {/* 녹음 중지 버튼 */}
            {isRecording && (
                <button
                    onClick={offRecAudio}
                    className="px-6 py-3 mt-10 text-base font-semibold text-white rounded-full bg-primary-50"
                >
                    녹음 중지
                </button>
            )}

            {/* 녹음이 완료된 경우 메시지와 버튼 */}
            {audioUrl && (
                <div className="flex flex-col items-center mt-4 space-y-5">
                    <p className="text-lg font-medium text-center">
                        사용자 목소리 녹음이 완료되었습니다 :)
                    </p>
                    <button
                        onClick={() => navigate("/main")} // 메인 페이지로 이동
                        className="px-8 py-4 text-lg font-semibold text-white rounded-full bg-primary-50"
                    >
                        복숭아 멘토 시작하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuestRecord;
