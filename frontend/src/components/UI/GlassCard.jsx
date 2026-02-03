import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = false }) => {
    return (
        <div className={`
            glass-panel rounded-2xl p-6 relative overflow-hidden
            ${hoverEffect ? 'hover:border-white/20 transition-colors duration-300' : ''}
            ${className}
        `}>
            {/* Holographic noise overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-command-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
