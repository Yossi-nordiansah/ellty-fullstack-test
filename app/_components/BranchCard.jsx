import React from 'react';
import { timeAgo } from '../_lib/dateUtils';

const BranchCard = ({ 
    child, 
    cIdx, 
    user, 
    onReply, 
    onLogin,
    isExpanded,
    replies,
    loading,
    onToggle
}) => {
    return (
        <div className="relative z-10 transition-all duration-300 hover:translate-x-1">
            {/* Connector Marker */}
            <div className="absolute left-[-40px] md:left-[-54px] top-1/2 -translate-y-1/2 size-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-primary border-4 border-slate-100 dark:border-slate-800 shadow-md">
                <span className="material-symbols-outlined text-lg font-black">
                    {child.operationType === "ADD"
                        ? "add"
                        : child.operationType === "SUB"
                        ? "remove"
                        : child.operationType === "MUL"
                        ? "close"
                        : "percent"}
                </span>
            </div>

            <div className="glass-card p-8 rounded-3xl border-l-[6px] border-l-primary hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg hover:shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <p className="text-3xl font-black tracking-tight">
                        <span className="text-slate-400 font-medium mr-2">
                            {child.operationType === "ADD"
                                ? "+"
                                : child.operationType === "SUB"
                                ? "-"
                                : child.operationType === "MUL"
                                ? "×"
                                : "÷"}{" "}
                            {child.rightValue}
                        </span>
                        <span className="material-symbols-outlined align-middle mx-3 text-slate-300">
                            arrow_forward
                        </span>
                        <span className="text-primary">
                            {Number(child.resultValue).toLocaleString()}
                        </span>
                    </p>
                    <div className="text-[10px] bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full font-black text-slate-500 uppercase tracking-widest">
                        Branch #{cIdx + 1}
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/30">
                    <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden relative">
                            {child.user?.avatarUrl ? (
                                <img
                                    src={child.user.avatarUrl}
                                    alt={child.user.username || "User"}
                                    className="size-full object-cover"
                                />
                            ) : (
                                child.user?.username?.[0]?.toUpperCase() || "U"
                            )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                            by{" "}
                            <span className="text-slate-800 dark:text-slate-200 font-bold">
                                {child.user?.username || "User"}
                            </span>{" "}
                            •{" "}
                            •{" "}
                            {timeAgo(child.createdAt)}
                        </p>
                    </div>
                    <button
                        onClick={() => (user ? onReply(child) : onLogin())}
                        className="text-primary hover:text-primary/70 transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-tighter"
                    >
                        REPLY{" "}
                        <span className="rotate-180 inline-block text-lg">
                            ➥
                        </span>
                    </button>
                </div>

                {/* Nested Replies Section */}
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        {isExpanded ? (
                            <>
                                <span className="material-symbols-outlined text-sm">expand_less</span>
                                Hide Replies
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                                View Replies
                            </>
                        )}
                    </button>

                    {isExpanded && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800/50">
                            {loading ? (
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                    Loading...
                                </div>
                            ) : replies && replies.length > 0 ? (
                                replies.map((reply) => (
                                    <div key={reply.id} className="relative group/reply bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="size-5 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500 overflow-hidden">
                                                    {reply.user?.avatarUrl ? (
                                                        <img src={reply.user.avatarUrl} className="size-full object-cover" />
                                                    ) : reply.user?.username?.[0]}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{reply.user?.username}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">{timeAgo(reply.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                            <span className="text-slate-400">
                                                {reply.operationType === 'ADD' ? '+' : reply.operationType === 'SUB' ? '-' : reply.operationType === 'MUL' ? '×' : '÷'}
                                                {reply.rightValue}
                                            </span>
                                            <span className="material-symbols-outlined text-xs text-slate-300">arrow_forward</span>
                                            <span className="text-primary">{Number(reply.resultValue).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-slate-400 italic">No replies yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BranchCard;
