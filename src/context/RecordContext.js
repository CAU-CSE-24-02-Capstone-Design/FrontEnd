import {createContext, useContext, useState} from 'react';

const RecordContext = createContext();

export const useRecordContext = () => useContext(RecordContext);

export const RecordProvider = ({children}) => {
    const [userAudioUrl, setUserAudioUrl] = useState(null);
    const [aiAudioUrl, setAiAudioUrl] = useState(null);
    const [userScript, setUserScript] = useState("");
    const [aiScript, setAiScript] = useState("");
    const [feedback, setFeedback] = useState("");

    return (
        <RecordContext.Provider value={{
            userAudioUrl, setUserAudioUrl,
            aiAudioUrl, setAiAudioUrl,
            userScript, setUserScript,
            aiScript, setAiScript,
            feedback, setFeedback,
        }}>
            {children}
        </RecordContext.Provider>
    );
};