import React, {useEffect, useRef, useState} from "react";
import Header from "../../components/Header";
import NavBar from "../../components/NavBar";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {useLocation} from "react-router-dom"; // 임시 더미 데이터

const StatisticsPage = () => {
    const [activeKey, setActiveKey] = useState("추임새"); // 디폴트는 추임새
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollRef = React.useRef(null);
    const location = useLocation();
    const statisticsDataRef = useRef([]);

    // 페이지 렌더링 후 가장 최근 데이터가 보이도록 스크롤 조정
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const encodedStatisticsData = searchParams.get("statisticsData");

        if (encodedStatisticsData) {
            try {
                statisticsDataRef.current = JSON.parse(decodeURIComponent(encodedStatisticsData));
                console.log(statisticsDataRef.current);
            } catch (error) {
                console.error("통계 데이터 디코딩 실패:", error);
            }
        }

        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [location]);

    const handleDragScroll = (event) => {
        const isTouch = event.type === "touchstart" || event.type === "touchmove";
        const clientX = isTouch ? event.touches[0].clientX : event.clientX;

        if (scrollRef.current) {
            scrollRef.current.scrollLeft += scrollPosition - clientX;
        }
        setScrollPosition(clientX);
    };

    return (
        <div className="w-full h-full max-w-[500px] mx-auto flex flex-col bg-white">
            <Header/>
            <div className="flex flex-col items-center flex-grow p-4">
                <p className="px-4 py-2 my-4 text-base rounded-md text-grayscale-90 font-paperlogy-title bg-grayscale-10">
                    최근 기록을 확인하고 나의 말하기 습관을 분석해보세요.
                </p>
                <p className="mb-4 text-sm text-grayscale-90 font-paperlogy-title">
                    좌우로 스크롤 하면 이전 기록을 한 번에 확인할 수 있어요
                </p>

                {/* 그래프 영역 */}
                <div
                    className="w-full max-w-[400px] overflow-x-auto scrollbar-hide relative flex border rounded-3xl px-2"
                    ref={scrollRef}
                    onMouseDown={(e) => setScrollPosition(e.clientX)}
                    onMouseMove={(e) => e.buttons === 1 && handleDragScroll(e)}
                    onMouseUp={() => setScrollPosition(0)}
                    onTouchStart={(e) => setScrollPosition(e.touches[0].clientX)}
                    onTouchMove={handleDragScroll}
                    onTouchEnd={() => setScrollPosition(0)}
                >
                    {/* Y축 */}
                    <div className="w-[50px] h-[300px] sticky left-0 z-10 bg-white">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={statisticsDataRef.current}>
                                <YAxis
                                    width={50}
                                    tick={{fontSize: 12, fill: "#333"}}
                                    axisLine={false}
                                    tickLine={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 그래프 */}
                    <div className="flex-grow h-full">
                        <ResponsiveContainer width={700} height={300}>
                            <LineChart
                                data={statisticsDataRef.current}
                                margin={{top: 20, right: 20, left: 20, bottom: 10}}
                            >
                                {/* 그래프 선 */}
                                <Line
                                    type="monotone"
                                    dataKey={activeKey}
                                    stroke="#5D9CEC"
                                    strokeWidth={3}
                                    dot={{fill: "#5D9CEC", r: 3}}
                                    activeDot={{fill: "#34495E", r: 7}}
                                />
                                {/* X축 */}
                                <XAxis
                                    dataKey="day"
                                    tick={{fontSize: 12, fill: "#333"}}
                                    tickFormatter={(day) => day.substring(5)}
                                    axisLine={{stroke: "#ccc"}}
                                    tickLine={false}
                                    interval={0}
                                    padding={{left: 0, right: 0}}
                                />
                                {/* 커스텀 Tooltip */}
                                <Tooltip
                                    cursor={false}
                                    contentStyle={{
                                        backgroundColor: "#D6EDFF",
                                        borderRadius: "8px",
                                        color: "#000000",
                                        fontSize: "14px",
                                    }}
                                    labelFormatter={(label) =>
                                        `날짜: ${label.substring(5).replace("-", "/")}`
                                    }
                                    itemStyle={{color: "#00325C"}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* 분석 종류 버튼 */}
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        onClick={() => setActiveKey("추임새")}
                        className={`px-7 py-3 text-base font-semibold rounded-full ${
                            activeKey === "추임새"
                                ? "bg-primary-50 text-white"
                                : "bg-grayscale-20 text-gray-700"
                        }`}
                    >
                        추임새
                    </button>
                    <button
                        onClick={() => setActiveKey("침묵시간")}
                        className={`px-7 py-3 text-base font-semibold rounded-full ${
                            activeKey === "침묵시간"
                                ? "bg-primary-50 text-white"
                                : "bg-grayscale-20 text-gray-700"
                        }`}
                    >
                        침묵시간
                    </button>
                </div>
            </div>
            <NavBar/>
            {/* 그래프 좌우 스크롤바 숨김 처리 */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, and Opera */
                }
            `}</style>
        </div>
    );
};

export default StatisticsPage;
