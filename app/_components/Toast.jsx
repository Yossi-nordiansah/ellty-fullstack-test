'use client';

import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto hide after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl animate-in slide-in-from-right duration-300 ${
      type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
    }`}>
      <span className="material-symbols-outlined font-bold">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      <p className="font-bold">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export default Toast;
