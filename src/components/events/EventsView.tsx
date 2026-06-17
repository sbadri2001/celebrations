import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, ChevronRight, Info, Trash2 } from 'lucide-react';
import { EventItem } from '../../types';

interface EventsViewProps {
  events: EventItem[];
  onTriggerCreateEvent: () => void;
  onTriggerRegisterParticipant: (eventTitle: string) => void;
  onDeleteEvent: (id: string, title: string) => void;
  colorAccentClass: { bgClass: string; textClass: string };
}

export default function EventsView({
  events,
  onTriggerCreateEvent,
  onTriggerRegisterParticipant,
  onDeleteEvent,
  colorAccentClass
}: EventsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'next-up' | 'upcoming'>('all');

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <motion.div
      key="events-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Events Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Add, update, and manage the schedule of the summer festival.</p>
        </div>
        <button 
          onClick={onTriggerCreateEvent}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl ${colorAccentClass.bgClass} hover:opacity-90 text-white font-bold text-sm shadow-xs cursor-pointer`}
        >
          <Plus className="w-4.5 h-4.5" />
          Create Event
        </button>
      </div>

      {/* Event Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="md:col-span-8 relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event title, group or audience info..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] transition-all font-medium text-slate-800"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-50/60 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none transition-all cursor-pointer font-sans"
          >
            <option value="all">📊 All Statuses</option>
            <option value="ongoing">🟢 Ongoing Only</option>
            <option value="next-up">⚡ Next Up Only</option>
            <option value="upcoming">🗓️ Upcoming Only</option>
          </select>
        </div>
      </div>

      {/* Events Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                {/* Event Category Badge */}
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                  evt.category === 'junior' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' :
                  evt.category === 'senior' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                  evt.category === 'adult' ? 'bg-sky-50 text-sky-700 border border-sky-105' :
                  'bg-slate-50 text-slate-700 border border-slate-200/60'
                }`}>
                  {evt.category === 'junior' ? '🧒' : evt.category === 'senior' ? '👵' : '👨'} {evt.category} Target
                </span>

                {/* Status Label */}
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  evt.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                  evt.status === 'next-up' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {evt.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mt-4 leading-snug">{evt.title}</h3>
              <p className="text-slate-500 font-medium text-xs mt-1.5 leading-normal">{evt.subtitle}</p>
            </div>

            <div className="border-t border-slate-150/40 mt-6 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium font-sans">🕒 {evt.timeInfo}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDeleteEvent(evt.id, evt.title)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors mr-1"
                  title="Remove Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTriggerRegisterParticipant(evt.title)}
                  className="text-xs font-black text-[#a83200] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Register
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium font-sans">
            <Info className="w-8 h-8 mx-auto text-slate-300" />
            <p className="mt-3">No community sessions found matching your queries.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
