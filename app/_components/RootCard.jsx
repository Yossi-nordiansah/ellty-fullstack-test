import React from "react";
import { timeAgo } from "../_lib/dateUtils";

const RootCard = ({ root, idx, user, onBranch, onLogin }) => {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden mb-8 relative z-10 transition-transform duration-500 hover:scale-[1.01] shadow-2xl hover:shadow-primary/5">
      <div
        className={`p-14 flex items-center justify-center relative overflow-hidden ${
          idx % 3 === 0
            ? "bg-gradient-to-br from-blue-400/20 to-primary/20"
            : idx % 3 === 1
            ? "bg-gradient-to-br from-emerald-400/20 to-emerald-600/20"
            : "bg-gradient-to-br from-purple-400/20 to-purple-600/20"
        }`}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        {idx % 3 === 0 ? (
          <div className="text-primary text-8xl font-black tracking-tighter drop-shadow-sm select-none">
            ƒx
          </div>
        ) : idx % 3 === 1 ? (
          <div className="text-emerald-500 flex items-center justify-center bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-emerald-100 dark:border-emerald-800/30">
            <span className="material-symbols-outlined text-6xl font-black">
              calculate
            </span>
          </div>
        ) : (
          <div className="text-purple-500 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full p-6 shadow-xl border border-purple-100 dark:border-purple-800/30 animate-pulse">
            <span className="material-symbols-outlined text-6xl font-black">
              hub
            </span>
          </div>
        )}
      </div>
      <div className="p-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden relative">
            {root.user?.avatarUrl ? (
              <img
                src={root.user.avatarUrl}
                alt={root.user.username || "User"}
                className="size-full object-cover"
              />
            ) : (
              root.user?.username?.[0]?.toUpperCase() || "S"
            )}
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              Started by
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {root.user?.username || "System"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
                {timeAgo(root.createdAt)}
            </p>
          </div>
        </div>
        <h3 className="text-7xl font-black mb-10 tracking-tighter text-slate-900 dark:text-white">
          {Number(root.resultValue).toLocaleString()}
        </h3>
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            ORIGIN NODE
          </span>
          <button
            onClick={() => (user ? onBranch(root) : onLogin())}
            className="group/btn flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:shadow-[0_15px_30px_-5px_rgba(19,127,236,0.3)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:rotate-12">
              account_tree
            </span>
            <span>Create Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RootCard;