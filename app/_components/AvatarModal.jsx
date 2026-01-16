'use client';

import React, { useState } from 'react';

const AvatarModal = ({ isOpen, onClose, onUpdate, currentAvatar }) => {
  const [selectedType, setSelectedType] = useState('cartoon_male');
  const [uploadLoading, setUploadLoading] = useState(false);

  const presets = {
    cartoon_male: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander',
    cartoon_female: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana',
  };

  const handlePresetSelect = async (type) => {
    setSelectedType(type);
    setUploadLoading(true);
    try {
      const res = await fetch('/api/users/me/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: presets[type] }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated.avatarUrl);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update avatar preset:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    // Convert to base64 for simplicity in this demo, 
    // ideally use a storage service
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/users/me/avatar', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: reader.result }),
        });
        if (res.ok) {
          const updated = await res.json();
          onUpdate(updated.avatarUrl);
          onClose();
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="glass-card max-w-sm w-full p-6 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tighter">Profile Avatar</h2>
          <button onClick={onClose} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Current Preview */}
          <div className="flex justify-center">
            <div className="relative size-24 group">
              <div className="size-full rounded-full border-4 border-primary/20 p-1 overflow-hidden bg-white dark:bg-slate-800">
                <img 
                  src={currentAvatar || presets.cartoon_male} 
                  alt="Avatar" 
                  className="size-full rounded-full object-cover"
                />
              </div>
              {uploadLoading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 rounded-full flex items-center justify-center">
                  <div className="size-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Preset Options */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handlePresetSelect('cartoon_male')}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedType === 'cartoon_male' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
              title="Male Avatar"
            >
              <div className="relative size-16 rounded-full bg-white dark:bg-slate-700 shadow-sm overflow-hidden">
                <img src={presets.cartoon_male} alt="Male" className="size-full object-cover" />
              </div>
            </button>
            <button 
              onClick={() => handlePresetSelect('cartoon_female')}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedType === 'cartoon_female' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
              title="Female Avatar"
            >
              <div className="relative size-16 rounded-full bg-white dark:bg-slate-700 shadow-sm overflow-hidden">
                <img src={presets.cartoon_female} alt="Female" className="size-full object-cover" />
              </div>
            </button>
          </div>

          {/* Upload Option */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">upload</span>
                <p className="text-sm font-bold text-slate-500">Upload custom photo</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">PNG, JPG or SVG</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={onClose}
            className="w-full h-12 rounded-2xl font-black bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
