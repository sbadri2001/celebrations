import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Plus, 
  Target, 
  Palette, 
  ArrowUpRight, 
  RefreshCw, 
  Trophy, 
  Sparkles, 
  Utensils, 
  Info 
} from 'lucide-react';
import { EventItem, ActivityUpdate } from '../../types';

interface DashboardViewProps {
  headerTitle: string;
  headerSubtitle: string;
  totalRegistrationCounter: number;
  juniorCount: number;
  adultCount: number;
  seniorCount: number;
  ongoingEvent?: EventItem;
  nextUpEvent?: EventItem;
  updates: ActivityUpdate[];
  onTriggerRegistration: () => void;
  onTriggerCreateEvent: () => void;
  onShuffleUpdates: () => void;
  colorAccentClass: { bgClass: string; hoverBg: string; textClass: string };
}

export default function DashboardView({
  headerTitle,
  headerSubtitle,
  totalRegistrationCounter,
  juniorCount,
  adultCount,
  seniorCount,
  ongoingEvent,
  nextUpEvent,
  updates,
  onTriggerRegistration,
  onTriggerCreateEvent,
  onShuffleUpdates,
  colorAccentClass
}: DashboardViewProps) {
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  const historicalUpdates: ActivityUpdate[] = [
    { id: 'u5', type: 'football', title: "Football: Referee 'Mark Green' Confirmed", subtitle: 'Sports Grounds • 4h ago', timeAgo: '4h' },
    { id: 'u6', type: 'art', title: 'Art: Paint Supply Donation Received', subtitle: 'Hobby Room • 1d ago', timeAgo: '1d' },
    { id: 'u7', type: 'food', title: 'Food: 12 Food Licenses approved by City', subtitle: 'Festival Office • 1d ago', timeAgo: '1d' },
    { id: 'u8', type: 'yoga', title: 'Yoga: Yoga Mats Sanitized and Stacked', subtitle: 'Community Hall • 2d ago', timeAgo: '2d' }
  ];

  return (
    <motion.div
      key="dashboard-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 font-sans"
    >
      {/* Dashboard Content Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <span className="text-[12px] font-extrabold tracking-widest text-[#a83200] uppercase">
            Community Hub
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1 md:text-4xl">
            {headerTitle}
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-2 max-w-xl font-normal leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
        
        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={onTriggerRegistration}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 font-bold text-sm tracking-wide text-slate-700 shadow-xs cursor-pointer transition-all"
          >
            <UserPlus className="w-4.5 h-4.5 text-slate-500" />
            Registration
          </button>
          <button 
            onClick={onTriggerCreateEvent}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl ${colorAccentClass.bgClass} ${colorAccentClass.hoverBg} text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg cursor-pointer transition-all`}
          >
            <Plus className="w-4.5 h-4.5" />
            New Event
          </button>
        </div>
      </div>

      {/* Stats & Event Cards Section (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Total Participants Left Block Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between shadow-xs relative">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                  Total Participants
                </p>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <h2 className="text-5xl font-black tracking-tight text-[#a83200]">
                    {totalRegistrationCounter.toLocaleString()}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 font-sans">
                    ↑ 8%
                  </span>
                </div>
              </div>
              
              <div className="w-11 h-11 rounded-2xl bg-[#fdf5f2] flex items-center justify-center text-[#a83200] shrink-0 shadow-xs">
                <Users className="w-5.5 h-5.5" />
              </div>
            </div>
          </div>

          {/* Age Category Pills */}
          <div className="flex flex-wrap gap-2.5 mt-8 border-t border-slate-100/85 pt-5">
            <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
              <span className="text-xs font-semibold text-slate-600">
                Juniors: <span className="font-extrabold text-slate-800 ml-1">{juniorCount}</span>
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
              <span className="text-xs font-semibold text-slate-600">
                Adults: <span className="font-extrabold text-slate-800 ml-1">{adultCount}</span>
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
              <span className="text-xs font-semibold text-slate-600">
                Seniors: <span className="font-extrabold text-slate-800 ml-1">{seniorCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right block: Live Event Mini Status-Boxes */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Ongoing Event Card */}
          <div className="flex-1 bg-blue-50/55 border border-blue-100/90 hover:border-blue-200 rounded-3xl p-5 flex flex-col justify-between transition-all relative">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-700">
                <Target className="w-4.5 h-4.5" />
              </div>
              <span className="bg-[#0560b8] text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider">
                Ongoing
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-[22px] font-extrabold text-[#02315d] leading-none shrink-0 m-0">
                {ongoingEvent?.title || "Cricket"}
              </h3>
              <p className="text-[13px] font-bold text-slate-500 mt-1">
                {ongoingEvent?.subtitle || "U-14 Finals"}
              </p>
            </div>
          </div>

          {/* Next Up Event Card */}
          <div className="flex-1 bg-amber-50/50 border border-amber-100/90 hover:border-amber-200 rounded-3xl p-5 flex flex-col justify-between transition-all relative">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-700">
                <Palette className="w-4.5 h-4.5" />
              </div>
              <span className="bg-slate-900 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider">
                Next Up
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-[22px] font-extrabold text-[#533902] leading-none">
                {nextUpEvent?.title || "Dance"}
              </h3>
              <p className="text-[13px] font-bold text-slate-500 mt-1">
                {nextUpEvent?.subtitle || "Starts 5:00 PM"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse Chart and Updates Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Participation Pulse Chart Grid Block */}
        <div className="xl:col-span-12 lg:xl:col-span-7 bg-[#b83a05] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[380px] h-full">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-widest text-orange-200/90 font-sans">
                Community Participation Pulse
              </p>
              <ArrowUpRight className="w-5.5 h-5.5 text-orange-200" />
            </div>

            {/* Chart visual mimicking the exact design */}
            <div className="mt-14 flex items-end justify-between gap-2 md:gap-3.5 h-44 px-2">
              {[
                { day: 'Mon', h: 'h-14', cap: '240', op: 'bg-white/40' },
                { day: 'Tue', h: 'h-24', cap: '420', op: 'bg-white/60' },
                { day: 'Wed', h: 'h-18', cap: '310', op: 'bg-white/40' },
                { day: 'Thu', h: 'h-32', cap: '610', op: 'bg-white/70' },
                { day: 'Fri', h: 'h-40', cap: '980', op: 'bg-white' },
                { day: 'Sat', h: 'h-28', cap: '540', op: 'bg-white/50' },
                { day: 'Sun', h: 'h-36', cap: '830', op: 'bg-white/85' },
                { day: 'Mon', h: 'h-24', cap: '410', op: 'bg-white/45' },
                { day: 'Tue', h: 'h-34', cap: '760', op: 'bg-white/80' },
                { day: 'Wed', h: 'h-20', cap: '330', op: 'bg-white/40' }
              ].map((bar, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl border border-slate-700">
                    {bar.cap} participants
                  </div>
                  
                  <div className={`w-full ${bar.h} ${bar.op} rounded-t-xl rounded-b-md group-hover:scale-y-105 origin-bottom transition-all shadow-xs`} />
                  
                  <span className="text-[9px] font-bold text-orange-200/80 mt-2 tracking-tighter">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center italic text-orange-100/85 text-xs tracking-wide font-medium mt-6">
            "Bringing the neighborhood together through play and art."
          </p>
        </div>

        {/* Right Latest Updates Card */}
        <div className="xl:col-span-12 lg:xl:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col shadow-xs">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#a83200] animate-spin-slow shrink-0" />
              <h3 className="text-sm font-black tracking-wider text-slate-800 uppercase">
                Latest Updates
              </h3>
            </div>
            <button 
              onClick={onShuffleUpdates} 
              className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
            >
              Verify Stack
            </button>
          </div>

          <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {updates.map((upd) => (
              <div key={upd.id} className="flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                
                {upd.type === 'football' && (
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
                    <Trophy className="w-4.5 h-4.5" />
                  </div>
                )}
                {upd.type === 'yoga' && (
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 shrink-0 shadow-xs">
                    <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                )}
                {upd.type === 'art' && (
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 shadow-xs">
                    <Palette className="w-4.5 h-4.5" />
                  </div>
                )}
                {upd.type === 'food' && (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                    <Utensils className="w-4.5 h-4.5" />
                  </div>
                )}
                {upd.type === 'announcement' && (
                  <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 shrink-0 shadow-xs">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {upd.title}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">
                    {upd.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {showAllUpdates && historicalUpdates.map((upd) => (
              <motion.div 
                key={upd.id} 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                  {upd.type === 'football' ? <Trophy className="w-4.5 h-4.5" /> : 
                   upd.type === 'yoga' ? <Sparkles className="w-4.5 h-4.5" /> : 
                   upd.type === 'art' ? <Palette className="w-4.5 h-4.5" /> : 
                   <Utensils className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">{upd.title}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">{upd.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setShowAllUpdates(!showAllUpdates)}
            className="mt-5 w-full py-3 border border-dashed border-slate-300 hover:border-slate-500 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all text-center tracking-wide"
          >
            {showAllUpdates ? "Hide Older Updates" : "Show More Updates"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
