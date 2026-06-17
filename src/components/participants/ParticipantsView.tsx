import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { Participant } from '../../types';

interface ParticipantsViewProps {
  participants: Participant[];
  onTriggerRegister: () => void;
  onDeleteParticipant: (id: string, name: string) => void;
}

export default function ParticipantsView({
  participants,
  onTriggerRegister,
  onDeleteParticipant
}: ParticipantsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<'all' | 'junior' | 'adult' | 'senior'>('all');

  const filteredParticipants = useMemo(() => {
    return participants.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            part.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            part.registeredEvent.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = groupFilter === 'all' || part.ageGroup === groupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [participants, searchQuery, groupFilter]);

  return (
    <motion.div
      key="participants-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Registrations List</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor, query, and remove register status of team participants.</p>
        </div>
        <button 
          onClick={onTriggerRegister}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4.5 h-4.5" />
          Register Participant
        </button>
      </div>

      {/* Query & Filter box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="md:col-span-8 relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, or registered session title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] transition-all font-medium text-slate-800"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-50/60 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none transition-all cursor-pointer font-sans"
          >
            <option value="all">👥 All Groups</option>
            <option value="junior">🧒 Juniors (1-17 yrs)</option>
            <option value="adult">👨 Adults (18-64 yrs)</option>
            <option value="senior">👵 Seniors (65+ yrs)</option>
          </select>
        </div>
      </div>

      {/* Participants Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/45 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                <th className="px-6 py-4.5">Full Name</th>
                <th className="px-6 py-4.5">Age Group</th>
                <th className="px-6 py-4.5">Email Address</th>
                <th className="px-6 py-4.5">Registered Session</th>
                <th className="px-6 py-4.5">Registered At</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredParticipants.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border">
                        {part.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 font-sans">{part.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase ${
                      part.ageGroup === 'junior' ? 'bg-orange-100 text-orange-800 border border-orange-200/40 font-mono' :
                      part.ageGroup === 'senior' ? 'bg-purple-100 text-purple-800 border border-purple-200/40 font-mono' :
                      'bg-sky-100 text-sky-850 font-mono'
                    }`}>
                      {part.ageGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 font-mono text-xs text-slate-500">{part.email}</td>
                  <td className="px-6 py-4.5 font-semibold text-slate-800">{part.registeredEvent}</td>
                  <td className="px-6 py-4.5 text-slate-400 font-medium font-sans">{part.dateAdded}</td>
                  <td className="px-6 py-4.5 text-right">
                    <button
                      onClick={() => onDeleteParticipant(part.id, part.name)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium font-sans">
                    No registered participants found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
