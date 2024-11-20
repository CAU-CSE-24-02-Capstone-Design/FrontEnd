import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import KakaoRedirectPage from "./components/oauth/KakaoRedirectPage";
import NaverRedirectPage from "./components/oauth/NaverRedirectPage";
import GoogleRedirectPage from "./components/oauth/GoogleRedirectPage";
import Main from "./pages/Main";
import MyPage from "./pages/MyPage";
import Calendar from "./pages/Calendar";
import Statistics from "./pages/Statistics";
import GuestRecord from "./pages/GuestRecord";
import RecordScript from "./pages/RecordScript";
import "./App.css";
import Feedback from "./pages/Feedback";
import Speech from "./pages/Speech";
import Loading from "./components/Loading";

const App = () => {
    return (
        <div className="App bg-[#f9f9f9] min-h-screen flex flex-col justify-center items-center">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route
                        path="/login/oauth2/code/kakao"
                        element={<KakaoRedirectPage/>}
                    />
                    <Route
                        path="/login/oauth2/code/naver"
                        element={<NaverRedirectPage/>}
                    />
                    <Route
                        path="/login/oauth2/code/google"
                        element={<GoogleRedirectPage/>}
                    />
                    <Route path="/main" element={<Main/>}/>
                    <Route path="/speech" element={<Speech/>}/>

                    {/* Header의 마이페이지 경로 */}
                    <Route path="/mypage" element={<MyPage/>}/>

                    {/* NavBar의 탭 연결 페이지 경로 */}
                    <Route path="/calendar" element={<Calendar/>}/>
                    <Route path="/statistics" element={<Statistics/>}/>

                    {/* GuestRecord */}
                    <Route path="/guestrecord" element={<GuestRecord/>}/>

                    {/* RecordScript */}
                    <Route path="/recordscript" element={<RecordScript/>}/>

                    {/* 해당 날짜의 피드백 페이지 */}
                    <Route path="/feedback" element={<Feedback/>}/>

                    <Route path="/loading" element={<Loading/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
