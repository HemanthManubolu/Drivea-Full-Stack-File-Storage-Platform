import React from "react";

export function ProgressBar({ progress = 0, className = "", color = "bg-orange-600" }) {
    return (
        <div className={`w-full bg-slate-200 rounded-full h-2 overflow-hidden ${className}`}>
            <div
                className={`h-full ${color} transition-all duration-300 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
}
