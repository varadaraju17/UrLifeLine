import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const NeonButton = ({
    children,
    onClick,
    variant = 'primary', // primary (blue), danger (red), success (emerald), void (ghost)
    className = '',
    isLoading = false,
    type = 'button',
    disabled = false
}) => {

    const baseStyles = "relative px-6 py-3 rounded-xl font-display font-bold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";

    const variants = {
        primary: "bg-command-600/10 text-command-500 border border-command-500/50 hover:bg-command-600 hover:text-white shadow-[0_0_20px_rgba(0,204,255,0.2)] hover:shadow-[0_0_40px_rgba(0,204,255,0.6)]",
        danger: "bg-alert-500/10 text-alert-500 border border-alert-500/50 hover:bg-alert-500 hover:text-white shadow-[0_0_20px_rgba(255,51,51,0.2)] hover:shadow-[0_0_40px_rgba(255,51,51,0.6)]",
        success: "bg-success-500/10 text-success-500 border border-success-500/50 hover:bg-success-500 hover:text-white shadow-[0_0_20px_rgba(0,255,153,0.2)] hover:shadow-[0_0_40px_rgba(0,255,153,0.6)]",
        void: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                {children}
            </div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:animate-scan-line" />
        </motion.button>
    );
};

export default NeonButton;
