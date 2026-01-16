import React from 'react'

const Footer = () => {
    return (
        <footer className="relative mt-32 py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800/50">
            <div className="max-w-[1400px] mx-auto px-6 flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-8 mb-10">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">Documentation</button>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">API Status</button>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">GitHub</button>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">Privacy</button>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold font-display">
                        © 2026 Number Discussions. All calculations are public and immutable.
                    </p>
                    <p className="text-slate-300 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        @Ellty Fullstack Test Assignment
                    </p>
                </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </footer>
    )
}

export default Footer