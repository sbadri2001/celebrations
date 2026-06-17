import React from 'react';
import { motion } from 'motion/react';
import { Bell, Check } from 'lucide-react';
import { AlertNotification } from '../../types';

interface AlertsViewProps {
  alerts: AlertNotification[];
  unreadAlertsCount: number;
  onMarkAllAlertsRead: () => void;
  onDismissAlert: (id: string, title: string) => void;
}

export default function AlertsView({
  alerts,
  unreadAlertsCount,
  onMarkAllAlertsRead,
  onDismissAlert
}: AlertsViewProps) {
  return (
    <motion.div
      key="alerts-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Broadcasting Station
            {unreadAlertsCount > 0 && (
              <span className="bg-red-650 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full">{unreadAlertsCount} Urgent</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review urgent community alerts, traffic, and logistics broadcastings.</p>
        </div>
        {unreadAlertsCount > 0 && (
          <button 
            onClick={onMarkAllAlertsRead}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-sm tracking-wide text-slate-700 shadow-xs cursor-pointer transition-colors"
          >
            <Check className="w-4.5 h-4.5" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Alert List Accordion */}
      <div className="space-y-4">
        {alerts.map((alrt) => (
          <div 
            key={alrt.id} 
            className={`p-5 rounded-2xl border transition-all ${
              alrt.unread 
                ? 'border-red-200 bg-red-50/20 shadow-xs' 
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 ${alrt.unread ? 'bg-red-100 text-red-650 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-base tracking-wide ${alrt.unread ? 'font-black text-red-955 text-red-900' : 'font-bold text-slate-800'}`}>
                    {alrt.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase mt-1 inline-block">{alrt.time}</span>
                  <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">{alrt.message}</p>
                </div>
              </div>
              
              {alrt.unread && (
                <button
                  onClick={() => onDismissAlert(alrt.id, alrt.title)}
                  className="text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-medium">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="mt-3">No broadcasting bulletins or alerts have been recorded.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
