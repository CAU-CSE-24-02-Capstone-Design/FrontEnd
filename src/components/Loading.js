import React from 'react'
import {PacmanLoader} from 'react-spinners';

const Loading = () => {
    return (
        <div>
            <PacmanLoader
                color="#1468dd"
                cssOverride={{}}
                loading
                margin={2}
                size={25}
                speedMultiplier={1}
            />
            <div style={{
                padding: '20px',
                color: '#1468dd',
                fontWeight: '700',
            }}>
                <h1> 로그인 중...</h1>
            </div>
        </div>
    )
}

export default Loading;