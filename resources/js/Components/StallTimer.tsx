import React, { useState, useEffect } from "react";

interface StallTimerProps {
    mode: "stopwatch" | "countdown";
    startTime: string | null;
    durationStr?: string | null; // e.g. "1 Jam", "2 Jam", "30 Menit"
}

export default function StallTimer({ mode, startTime, durationStr }: StallTimerProps) {
    const [displayTime, setDisplayTime] = useState<string>("00:00:00");
    const [progress, setProgress] = useState<number>(100);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        if (!startTime) {
            setDisplayTime("00:00:00");
            return;
        }

        const start = new Date(startTime).getTime();
        if (isNaN(start)) {
            setDisplayTime("00:00:00");
            return;
        }

        // Parse duration
        let durationMs = 0;
        if (mode === "countdown" && durationStr) {
            const num = parseInt(durationStr);
            if (!isNaN(num)) {
                if (durationStr.toLowerCase().includes("jam")) {
                    durationMs = num * 60 * 60 * 1000;
                } else if (durationStr.toLowerCase().includes("menit")) {
                    durationMs = num * 60 * 1000;
                } else {
                    durationMs = num * 60 * 60 * 1000; // default to hours
                }
            }
        }

        const endTime = start + durationMs;

        const updateTimer = () => {
            const now = Date.now();

            if (mode === "stopwatch") {
                const diff = Math.max(0, now - start);
                setDisplayTime(formatTime(diff));
            } else {
                const diff = endTime - now;
                if (diff <= 0) {
                    setDisplayTime("00:00:00");
                    setProgress(0);
                    setIsExpired(true);
                } else {
                    setDisplayTime(formatTime(diff));
                    setIsExpired(false);
                    if (durationMs > 0) {
                        const pct = (diff / durationMs) * 100;
                        setProgress(pct);
                    }
                }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, mode, durationStr]);

    const formatTime = (ms: number) => {
        const totalSecs = Math.floor(ms / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":");
    };

    if (mode === "stopwatch") {
        return (
            <div className="flex items-center gap-1.5 font-mono text-sm tracking-widest font-semibold bg-white/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{displayTime}</span>
            </div>
        );
    }

    // Countdown UI with simple horizontal bar inside the card (or circular border)
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-sm tracking-widest font-semibold bg-white/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm text-white">
                    <span className={`w-2 h-2 rounded-full ${isExpired ? "bg-red-500 animate-pulse" : "bg-primary animate-ping"}`} />
                    <span>{displayTime}</span>
                </div>
                {isExpired && (
                    <span className="text-[10px] font-extrabold text-red-300 animate-bounce uppercase">
                        WAKTU HABIS!
                    </span>
                )}
            </div>
            
            {durationStr && (
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${isExpired ? "bg-red-500" : progress < 15 ? "bg-amber-400 animate-pulse" : "bg-primary-foreground"}`} 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
