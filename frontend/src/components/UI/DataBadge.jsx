import React from 'react';

const DataBadge = ({ label, value, icon: Icon, color = "blue", trend, status, severity, className = "" }) => {
    // Mode 1: Status/Severity Pill
    if (status || severity) {
        const text = status || severity;
        const styles = {
            // Severities
            CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50',
            HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
            MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            LOW: 'bg-green-500/20 text-green-400 border-green-500/50',
            // Task Statuses
            PENDING: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
            IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
            RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
            ASSIGNED: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
            // Officer Status
            ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
            INACTIVE: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
        };

        // Default style if no match
        const activeStyle = styles[text?.toUpperCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/50';

        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${activeStyle} ${className}`}>
                {text}
            </span>
        );
    }

    // Mode 2: Stat Card (Original)
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20",
        green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${colors[color] || colors.blue} ${className}`}>
            {Icon && <Icon size={20} />}
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                    {value}
                    {trend && (
                        <span className={`text-xs ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataBadge;
