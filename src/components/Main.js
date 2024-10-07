import React from 'react';
import '../css/Main.css'; // Import the CSS file
import instance from '../axios/TokenInterceptor';
import Record from './Record';

const Main = () => {
    const testButton = async () => {
        try {
            const response = await instance.post('http://localhost:8080/test');
        } catch (error) {
            console.log("TEST!");
        }
    }

    return (
        <div className="main-container">
            <img src="/images/whale.png" alt="Whale" className="whale-image"/>
            <h1>메인 페이지~</h1>
            <button onClick={testButton} className="button">
                테스트용 버튼
            </button>
            <Record /> {/* Record 컴포넌트 추가 */}
        </div>
    );
};

export default Main;