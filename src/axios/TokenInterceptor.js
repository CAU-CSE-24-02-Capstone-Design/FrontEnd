import axios from 'axios';

const instance = axios.create();

instance.defaults.withCredentials = true;

// 요청 인터셉터 : API call 하기 전에 실행
instance.interceptors.request.use(function (config) {

    // 로컬 스토리지에서 accessToken을 가져온다
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);

    // accessToken이 있으면 요청 헤더에 추가한다.
    if (accessToken)
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;

}, function (error) {
    // 요청 오류 처리
    return Promise.reject(error);
});

// 응답 인터셉터 : 응답을 받고 then, catch 처리하기 전에 실행
// 토큰 재인증, 자동 로그아웃 등 처리
instance.interceptors.response.use(async function (response) {

    // 응답 데이터 있는 작업 수행
    // 2xx 범위에 있는 상태 코드인 경우
    return response;
}, async function (error) {

    // 응답 오류가 있는 작업 수행
    // 2xx 범위 밖에 있는 상태 코드인 경우

    const {config, response} = error;
    if (!response) {
        console.error('Network or server error', error);
        return Promise.reject(error);
    }

    // 백엔드단의 JWT Filter에서 걸리는 에러 처리
    const {status, data} = response;
    console.log(response);
    if (status === 401) {
        if (data.message === "토큰이 없습니다") {
            await Logout();
        }
        if (data.message === "유효하지 않은 토큰") {
            try {
                const tokenReissueResult = await instance.post('http://localhost:8080/reissue');
                if (tokenReissueResult.status === 200) {
                    // 재발급 성공시 로컬스토리지에 토큰 저장
                    const accessToken = tokenReissueResult.headers['authorization'] || tokenReissueResult.headers['Authorization'];
                    localStorage.setItem('accessToken', accessToken);
                    // 토큰 재발급 성공, API 재요청
                    console.log("토큰 재발급 성공");
                    return instance(config)
                } else {
                    await Logout();
                }
            } catch (e) {
                await Logout();
            }
        }
    }

    return Promise.reject(error);
});


const Logout = async () => {
    try {
        // 로그아웃 API 호출
        await axios.post('http://localhost:8080/logout');
        localStorage.removeItem('accessToken');
        window.location.href = '/'; // 로그인 페이지 이동
    } catch (error) {
        console.error('로그아웃 오류 발생:', error);
    }
};

export default instance;
