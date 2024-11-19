import React from "react";
import Header from "../../components/Header";
import GuestRecordComponent from "./components/GuestRecord";
import scriptContent from "../../constants/userRecordScript";

const ScriptBox = ({content}) => (
    <div className="p-6 bg-white border-2 rounded-lg shadow-md max-w-[380px] border-primary-40">
        <p className="leading-relaxed text-justify">{content}</p>
    </div>
);

const GuestRecord = () => {
    return (
        <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-[#fcfcfc]">
            <Header/>
            <main className="flex flex-col items-center justify-center flex-grow p-4">
                <ScriptBox content={scriptContent}/>
                <div className="mt-6">
                    <GuestRecordComponent/>
                </div>
            </main>
        </div>
    );
};

export default GuestRecord;
