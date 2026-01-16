"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import RootCard from "./_components/RootCard";
import BranchCard from "./_components/BranchCard";
import AvatarModal from "./_components/AvatarModal";
import Toast from "./_components/Toast";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, login, register, loading: authLoading, fetchUser } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(null); // stores parent object
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [expandedReplies, setExpandedReplies] = useState({}); // { [id]: boolean }
  const [nestedReplies, setNestedReplies] = useState({}); // { [id]: [] }
  const [loadingReplies, setLoadingReplies] = useState({}); // { [id]: boolean }

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [startValue, setStartValue] = useState("");
  const [branchValue, setBranchValue] = useState("");
  const [operationType, setOperationType] = useState("ADD");
  const [error, setError] = useState("");

  const fetchCalculations = async () => {
    try {
      const res = await fetch("/api/calculations");
      if (res.ok) {
        const data = await res.json();
        setCalculations(data);
      }
    } catch (err) {
      console.error("Failed to fetch calculations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(username, password);
    setSubmitting(false);
    if (res.success) {
      setShowLogin(false);
      setUsername("");
      setPassword("");
      setToast({ message: "Login successful! Welcome back.", type: "success" });
      fetchCalculations();
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await register(username, password);
    setSubmitting(false);
    if (res.success) {
      setToast({ message: "Account created! Logging you in...", type: "success" });
      setShowRegister(false);
      setShowLogin(true);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!user) return setShowLogin(true);
    setSubmitting(true);
    try {
      const res = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startValue: Number(startValue) }),
      });
      if (res.ok) {
        setShowStartModal(false);
        setStartValue("");
        fetchCalculations();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBranch = async (e) => {
    e.preventDefault();
    if (!user) return setShowLogin(true);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/calculations/${showBranchModal.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationType, value: Number(branchValue) }),
      });
      if (res.ok) {
        setShowBranchModal(null);
        setBranchValue("");
        setToast({ message: "Reply added!", type: "success" });
        if (showBranchModal.parentId) {
            // It's a nested reply (branch), refresh THIS node's children (replies)
            fetchReplies(showBranchModal.id);
            setExpandedReplies(prev => ({ ...prev, [showBranchModal.id]: true }));
        } else {
            // It's a root, refresh the main feed
             fetchCalculations();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fetchReplies = async (nodeId) => {
      if (loadingReplies[nodeId]) return;
      setLoadingReplies(prev => ({ ...prev, [nodeId]: true }));
      try {
          const res = await fetch(`/api/calculations/${nodeId}/children`);
          if (res.ok) {
              const children = await res.json();
              setNestedReplies(prev => ({ ...prev, [nodeId]: children }));
              setExpandedReplies(prev => ({ ...prev, [nodeId]: true }));
          }
      } catch (err) {
          console.error("Failed to fetch replies:", err);
      } finally {
        setLoadingReplies(prev => ({ ...prev, [nodeId]: false }));
      }
  };

  const toggleReplies = (nodeId) => {
      if (expandedReplies[nodeId]) {
          setExpandedReplies(prev => ({ ...prev, [nodeId]: false }));
      } else {
          fetchReplies(nodeId);
      }
  };

  // Helper for Sidebar - Latest Activity
  const getLatestActivity = () => {
    const allActivities = [];
    calculations.forEach((tree) => {
      tree.children.forEach((child) => {
        allActivities.push({
          treeId: tree.id.substring(0, 4),
          ...child,
        });
      });
    });
    return allActivities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  const latestActivities = getLatestActivity();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white transition-colors duration-200 min-h-screen selection:bg-primary selection:text-white">
      <Navbar
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onOpenAvatar={() => setShowAvatarModal(true)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative dot-grid min-h-screen pb-20">
        {/* Floating math symbols in background */}
        <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <span
            className="absolute top-[10%] left-[5%] text-slate-300 dark:text-slate-800 text-6xl font-bold opacity-10 animate-float"
            style={{ animationDelay: "0s" }}
          >
            +
          </span>
          <span
            className="absolute top-[25%] right-[10%] text-slate-300 dark:text-slate-800 text-8xl font-bold opacity-10 animate-float"
            style={{ animationDelay: "1s" }}
          >
            ×
          </span>
          <span
            className="absolute bottom-[20%] left-[15%] text-slate-300 dark:text-slate-800 text-7xl font-bold opacity-10 animate-float"
            style={{ animationDelay: "2.5s" }}
          >
            ÷
          </span>
          <span
            className="absolute top-[60%] right-[5%] text-slate-300 dark:text-slate-800 text-9xl font-bold opacity-10 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            -
          </span>
          <span
            className="absolute bottom-[10%] right-[20%] text-slate-300 dark:text-slate-800 text-5xl font-bold opacity-10 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            %
          </span>
        </div>

        <main className="max-w-[1400px] mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 relative z-10">
          <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 p-8 rounded-3xl backdrop-blur-md border border-white/20 dark:border-slate-800/20 shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-extrabold tracking-tighter">
                    Global Calculation Feed
                  </h2>
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-200 dark:border-red-500/20 shadow-sm">
                    <span className="size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none">
                      Live
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Discover live mathematical branches from across the network.
                </p>
              </div>
              <button
                onClick={() =>
                  user ? setShowStartModal(true) : setShowLogin(true)
                }
                className="group relative flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_20px_40px_-10px_rgba(19,127,236,0.4)] transition-all active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="material-symbols-outlined text-2xl font-black">
                  add
                </span>
                <span>New Calculation</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="relative size-16">
                  <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Synchronizing Feed...
                </p>
              </div>
            ) : calculations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 glass-card rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">
                  analytics
                </span>
                <p className="text-slate-500 dark:text-slate-400 font-bold">
                  No discussions yet. Be the first to start!
                </p>
              </div>
            ) : (
              <div className="space-y-24">
                {calculations.map((root, idx) => (
                  <div key={root.id} className="relative group/tree">
                    {/* Root Card */}
                    <RootCard 
                        root={root} 
                        idx={idx} 
                        user={user} 
                        onBranch={setShowBranchModal} 
                        onLogin={() => setShowLogin(true)} 
                    />

                    {/* Branches */}
                    {root.children && root.children.length > 0 && (
                      <div className="ml-12 md:ml-20 space-y-6 relative">
                        {/* Vertical Connection Line */}
                        <div className="absolute left-[-26px] md:left-[-40px] top-[-32px] bottom-[32px] w-1 bg-gradient-to-b from-slate-200 via-primary/30 to-slate-200 dark:from-slate-800 dark:via-primary/20 dark:to-slate-800 rounded-full -z-0"></div>

                        {root.children.map((child, cIdx) => (
                           <BranchCard 
                                key={child.id}
                                child={child}
                                cIdx={cIdx}
                                user={user}
                                onReply={setShowBranchModal}
                                onLogin={() => setShowLogin(true)}
                                isExpanded={expandedReplies[child.id]}
                                replies={nestedReplies[child.id]}
                                loading={loadingReplies[child.id]}
                                onToggle={() => toggleReplies(child.id)}
                           />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-sm">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                  <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-2xl font-black">
                      history
                    </span>
                  </div>
                  Latest Activity
                </h3>

                <div className="space-y-6">
                  {latestActivities.length > 0 ? (
                    latestActivities.map((act, i) => (
                      <div
                        key={i}
                        className="group/act relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary/20 before:rounded-full hover:before:bg-primary transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                            TREE #{act.treeId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(act.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-base font-black mb-1 leading-tight group-hover/act:text-primary transition-colors">
                          {act.operationType === "ADD"
                            ? "+"
                            : act.operationType === "SUB"
                            ? "-"
                            : act.operationType === "MUL"
                            ? "×"
                            : "÷"}{" "}
                          {act.rightValue} →{" "}
                          {Number(act.resultValue).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          by{" "}
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            @{act.user?.username || "User"}
                          </span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center glass-card rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 text-center opacity-60">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-3">
                        auto_awesome
                      </span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Waiting for activity...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats or Info Card */}
              <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">
                  emoji_events
                </span>
                <p className="text-xl font-black mb-1">{calculations.length}</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Active Discussions
                </p>
              </div>
            </div>
          </aside>
        </main>
      </div>
      <Footer />

      {/* --- PREMIUM MODALS --- */}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="glass-card max-w-md w-full p-10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border-t-white/30 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter">
                Welcome Back
              </h2>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setError("");
                }}
                className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                  Username
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20 flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 text-sm">
                    error
                  </span>
                  <p className="text-red-600 dark:text-red-400 text-xs font-bold leading-tight">
                    {error}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 text-lg disabled:opacity-50"
              >
                {submitting ? (
                     <>
                        <div className="size-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        <span>Logging in...</span>
                     </>
                ) : (
                    "Login to Account"
                )}
              </button>
              <p className="text-center text-xs font-bold text-slate-500">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                  className="text-primary hover:underline"
                >
                  Create an account
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="glass-card max-w-md w-full p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter">
                Join the Lab
              </h2>
              <button
                onClick={() => {
                  setShowRegister(false);
                  setError("");
                }}
                className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold"
                  placeholder="Min. 3 characters"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold"
                  placeholder="Min. 6 characters"
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs font-bold px-1">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all text-lg disabled:opacity-50"
              >
                {submitting ? (
                     <>
                        <div className="size-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        <span>Creating Account...</span>
                     </>
                ) : (
                    "Create Free Account"
                )}
              </button>
              <p className="text-center text-xs font-bold text-slate-500 tracking-tight">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                  className="text-primary hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Start Modal - Redesigned to match "Add to Discussion" style */}
      {showStartModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-[1.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold tracking-tight">Add to Discussion</h2>
                <button onClick={() => setShowStartModal(false)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                </button>
            </div>
            
            <form onSubmit={handleStart} className="p-8 space-y-8">
              <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Enter Seed Value</label>
                    <input 
                      type="number" required value={startValue} onChange={e => setStartValue(e.target.value)}
                      className="w-full h-16 px-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 focus:border-primary outline-none font-black text-4xl text-center"
                      placeholder="0"
                    />
                  </div>
              </div>
              
              <div className="bg-blue-50/50 dark:bg-primary/5 p-6 rounded-2xl border border-blue-100 dark:border-primary/10 flex items-center gap-6">
                  <div className="flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">START PREVIEW</p>
                        <div>
                            <div className="text-3xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                                Result = <span className="text-primary">{Number(startValue || 0).toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400">This will be the root of a new calculation tree.</p>
                        </div>
                  </div>
                  <div className="size-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-4xl font-black">rocket_launch</span>
                  </div>
              </div>

              <div className="flex items-center justify-end gap-6 pt-4">
                <button type="button" onClick={() => setShowStartModal(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Cancel</button>
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 h-14 px-10 rounded-xl font-black bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                >
                    {submitting ? (
                        <div className="size-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    )}
                    <span>Start Discussion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch/Reply Modal - Redesigned to "Add to Discussion" */}
      {showBranchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-[1.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold tracking-tight">Add to Discussion</h2>
                <button onClick={() => setShowBranchModal(null)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
                </button>
            </div>

            <form onSubmit={handleBranch} className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Select Operator</label>
                    <div className="relative">
                        <select
                        value={operationType} onChange={e => setOperationType(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none font-bold appearance-none cursor-pointer text-sm"
                        >
                        <option value="ADD">+</option>
                        <option value="SUB">-</option>
                        <option value="MUL">×</option>
                        <option value="DIV">÷</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Enter Value</label>
                    <input
                      type="number" required value={branchValue} onChange={e => setBranchValue(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none font-bold text-sm"
                      placeholder="e.g. 5"
                    />
                  </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-primary/5 p-6 rounded-2xl border border-blue-100 dark:border-primary/10 flex items-center gap-6">
                  <div className="flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">RESULT PREVIEW</p>
                        {(() => {
                            const left = Number(showBranchModal.resultValue);
                            const right = Number(branchValue) || 0;
                            let res = 0;
                            if (operationType === 'ADD') res = left + right;
                            else if (operationType === 'SUB') res = left - right;
                            else if (operationType === 'MUL') res = left * right;
                            else if (operationType === 'DIV') res = right !== 0 ? left / right : 0;

                            return (
                                <div>
                                    <div className="text-3xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
                                        {Number(showBranchModal.resultValue).toLocaleString()} {operationType === 'ADD' ? '+' : operationType === 'SUB' ? '-' : operationType === 'MUL' ? '×' : '÷'} {right} = <span className="text-primary">{res.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400">Based on the current node value of {Number(showBranchModal.resultValue).toLocaleString()}</p>
                                </div>
                            );
                        })()}
                  </div>
                  <div className="size-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-4xl font-black">calculate</span>
                  </div>
              </div>

              <div className="flex items-center justify-end gap-6 pt-4">
                <button type="button" onClick={() => setShowBranchModal(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Cancel</button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-black bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                >
                    {submitting ? (
                        <div className="size-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                        <span className="material-symbols-outlined text-lg">add</span>
                    )}
                    <span>Add Operation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Management Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={user?.avatarUrl}
        onUpdate={() => fetchUser()}
      />
    </div>
  );
}
