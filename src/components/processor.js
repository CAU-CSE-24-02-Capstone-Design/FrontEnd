class WorkletProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        // AudioContext의 currentTime을 가져옵니다.
        const currentTime = this.port.context.currentTime;

        // 현재 시간을 메인 스레드로 전송합니다.
        this.port.postMessage({ currentTime: currentTime });

        return true; // 프로세스가 계속 진행되도록 true를 반환합니다.
    }
}

// AudioWorkletProcessor 등록
registerProcessor('worklet-processor', WorkletProcessor);