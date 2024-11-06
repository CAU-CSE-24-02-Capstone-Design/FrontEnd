import React, { createContext, useContext, useState } from "react";

const AnswerIdContext = createContext();

export const AnswerIdProvider = ({ children }) => {
    const [answerId, setAnswerId] = useState("");

    return (
        <AnswerIdContext.Provider value={{ answerId, setAnswerId }}>
            {children}
        </AnswerIdContext.Provider>
    );
};

export const useAnswerIdContext = () => useContext(AnswerIdContext);