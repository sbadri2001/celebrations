import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  communityName: string;
  setCommunityName: (val: string) => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  headerSubtitle: string;
  setHeaderSubtitle: (val: string) => void;
  accentColor: 'orange' | 'emerald' | 'blue' | 'indigo';
  setAccentColor: (val: 'orange' | 'emerald' | 'blue' | 'indigo') => void;
  onResetDefaults: () => void;
  onResetParticipants: () => void;
  triggerToast: (msg: string) => void;
  colorAccentClass: { bgClass: string; hoverBg: string; textClass: string };
}

export default function SettingsView({
  communityName,
  setCommunityName,
  headerTitle,
  setHeaderTitle,
  headerSubtitle,
  setHeaderSubtitle,
  accentColor,
  setAccentColor,
  onResetDefaults,
  onResetParticipants,
  triggerToast,
  colorAccentClass
}: SettingsViewProps) {
  return (
    <motion.div
      key="settings-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 font-sans"
    >
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portal Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Personalize the dashboard name, welcoming banner text, and branding palette colors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visual Settings Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          
          {/* Community Name setting */}
          <div>
            <label htmlFor="settings-community-name" className="block text-xs font-black uppercase text-slate-400 tracking-wider">Community Name</label>
            <input
              id="settings-community-name"
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-800"
            />
          </div>

          {/* Header morning phrase */}
          <div>
            <label htmlFor="settings-welcome-title" className="block text-xs font-black uppercase text-slate-400 tracking-wider">Welcome Banner Primary text</label>
            <input
              id="settings-welcome-title"
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-800"
            />
          </div>

          {/* Welcome banner subtitle */}
          <div>
            <label htmlFor="settings-welcome-subtitle" className="block text-xs font-black uppercase text-slate-400 tracking-wider">Welcome Banner Subtitle</label>
            <textarea
              id="settings-welcome-subtitle"
              rows={2}
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-800"
            />
          </div>

          {/* Accent palette styling selection */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Action Buttons Palette Color</label>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[
                { code: 'orange', name: 'Warm Sunset', col: 'bg-orange-600' },
                { code: 'emerald', name: 'Spring Sage', col: 'bg-emerald-600' },
                { code: 'blue', name: 'Skylight Blue', col: 'bg-blue-600' },
                { code: 'indigo', name: 'Royal Blossom', col: 'bg-indigo-600' }
              ].map((pal) => (
                <button
                  key={pal.code}
                  type="button"
                  onClick={() => setAccentColor(pal.code as any)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    accentColor === pal.code ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${pal.col} shadow-inner`} />
                  <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{pal.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
            <button
              onClick={onResetDefaults}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Reset Defaults
            </button>
            
            <button
              onClick={() => triggerToast('Portal configuration saved!')}
              className={`px-5 py-2.5 rounded-xl ${colorAccentClass.bgClass} text-white text-xs font-extrabold hover:opacity-90 cursor-pointer`}
            >
              Apply Changes
            </button>
          </div>
        </div>

        {/* Right block: Developer / Workspace info */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-wide font-sans">Workspace Environment</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans mt-2">
            <p>
              This application is built inside a high-fidelity **Google AI Studio sandbox** using:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
              <li>React 18 + TypeScript 5</li>
              <li>Tailwind CSS Engine</li>
              <li>Motion Animation Engine</li>
            </ul>
            <p>
              All database states (Events, Registrants, Teams, Notifications) remain dynamic and state-synchronized. 
              Changes instantly influence counters and live update columns.
            </p>
            
            <button 
              onClick={onResetParticipants}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-center tracking-wide cursor-pointer"
            >
              Reset Clean State Stores
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
