'use client';

import Link from 'next/link';
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import DarkMode from './DarkMode';

const Navbar = ({ onLogin, onRegister, onOpenAvatar }) => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-[60] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#f0f2f4]/50 dark:border-slate-800/50 shadow-sm transition-all">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <svg
                            className="size-6"
                            fill="currentColor"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_6_330)">
                                <path
                                    clipRule="evenodd"
                                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                                    fillRule="evenodd"
                                ></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_6_330">
                                    <rect fill="white" height="48" width="48"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">Number Discussions</h1>
                </div>
                <div className="flex gap-4 items-center">
                    {/* Dark/Light Toggle */}
                    <DarkMode />

                    {user ? (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={onOpenAvatar}>
                                <div className="size-9 rounded-xl overflow-hidden border border-primary/20 group-hover:border-primary transition-all">
                                    {user.avatarUrl ? (
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={user.username || "User Avatar"} 
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-0.5 tracking-widest">Active session</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={logout}
                                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                <span className="hidden xs:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 sm:gap-3">
                            <button 
                                onClick={onLogin}
                                className="flex items-center justify-center rounded-xl h-10 px-4 sm:px-6 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                            >
                                <span>Login</span>
                            </button>
                            <button 
                                onClick={onRegister}
                                className="flex items-center justify-center rounded-xl h-10 px-4 sm:px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                <span className="hidden xs:inline">Sign Up</span>
                                <span className="xs:hidden">Join</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
