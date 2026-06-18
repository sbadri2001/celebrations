import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Plus,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  AlertCircle,
  Send,
  Trash2,
  Settings,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Edition } from "../../types";
import Modal from "../common/Modal";

interface EditionsViewProps {
  editions: Edition[];
  isAdmin: boolean;
  onAddEdition: (newEdition: {
    name: string;
    year: number;
    description: string;
    isActive: boolean;
  }) => void;
  onActivateEdition: (id: string, name: string) => void;
  onDeactivateEdition: (id: string, name: string) => void;
  onDeleteEdition: (id: string, name: string) => void;
  triggerToast: (msg: string) => void;
  colorAccentClass: string;
}

export default function EditionsView({
  editions,
  isAdmin,
  onAddEdition,
  onActivateEdition,
  onDeactivateEdition,
  onDeleteEdition,
  triggerToast,
  colorAccentClass,
}: EditionsViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editionName, setEditionName] = useState("");
  const [editionYear, setEditionYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [editionDesc, setEditionDesc] = useState("");
  const [makeActiveImmediately, setMakeActiveImmediately] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      triggerToast("Error: Only administrators can create new editions.");
      return;
    }
    if (!editionName.trim()) {
      triggerToast("Please enter an edition name.");
      return;
    }

    onAddEdition({
      name: editionName.trim(),
      year: editionYear,
      description: editionDesc.trim() || "No description provided.",
      isActive: makeActiveImmediately,
    });

    setEditionName("");
    setEditionDesc("");
    setMakeActiveImmediately(false);
    setShowCreateForm(false);
  };

  const activeEdition = editions.find((e) => e.isActive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 font-sans pb-12"
    >
      {/* Upper Title Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-br from-white to-orange-50/20 p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-orange-100 text-[#a83200] text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Festival Config
            </span>
            {isAdmin ? (
              <span className="bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Access
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lock className="w-3 h-3" /> View Only Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Festival Editions
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Create, manage, and activate separate event cycles. Standard content
            like Teams and Events are scoped under the active edition.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all ${
              showCreateForm
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                : "bg-[#a83200] hover:bg-[#c03d00] text-white"
            }`}
          >
            {showCreateForm ? (
              "Cancel Creation"
            ) : (
              <>
                <Plus className="w-4 h-4" /> Create New Edition
              </>
            )}
          </button>
        )}
      </div>

      {/* Active Edition Highlight Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#fb923c]/40 bg-gradient-to-br from-[#fff7ed] via-white to-white p-6 sm:p-8 shadow-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffedd5]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              CURRENTLY ACTIVE
            </div>

            {activeEdition ? (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                  {activeEdition.name}
                  <span className="text-lg font-bold text-slate-400">
                    ({activeEdition.year})
                  </span>
                </h2>
                <p className="text-slate-600 font-medium text-sm mt-1 max-w-2xl">
                  {activeEdition.description}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-slate-400 tracking-tight">
                  No Active Edition
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1 max-w-xl">
                  All standard operations are currently paused. Admins must
                  activate an edition to enable teams registration, event
                  creation, and participants list.
                </p>
              </div>
            )}
          </div>

          {!activeEdition && isAdmin && (
            <button
              onClick={() => {
                const defaultDraft = editions.find((e) => !e.isActive);
                if (defaultDraft) {
                  onActivateEdition(defaultDraft.id, defaultDraft.name);
                } else {
                  setShowCreateForm(true);
                  triggerToast(
                    "Please fill out the form below to create your first edition!",
                  );
                }
              }}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0"
            >
              🚀 Activate First Draft Edition
            </button>
          )}
        </div>
      </div>

      {/* CREATE NEW EDITION FORM (COLLAPSIBLE) */}
      {showCreateForm && isAdmin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-lg text-slate-900">
              Define New Edition
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Edition Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer Festival 2026"
                  value={editionName}
                  onChange={(e) => setEditionName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2026"
                  value={editionYear}
                  onChange={(e) =>
                    setEditionYear(
                      Number(e.target.value) || new Date().getFullYear(),
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Festival Description / Bio
              </label>
              <textarea
                rows={3}
                placeholder="Give details about key events, theme, block divisions, or target goal for this edition..."
                value={editionDesc}
                onChange={(e) => setEditionDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                id="make-active-checkbox"
                type="checkbox"
                checked={makeActiveImmediately}
                onChange={(e) => setMakeActiveImmediately(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
              <label
                htmlFor="make-active-checkbox"
                className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
              >
                Activate and make this the single active edition immediately
                (deactivates others)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                Create Edition Draft
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ALL EDITIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span>All Configured Editions ({editions.length})</span>
        </h3>

        {editions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold">No editions created yet.</p>
            <p className="text-slate-400 text-xs mt-1">
              Create one using the button at the top to begin your
              configurations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editions.map((edition) => (
              <motion.div
                key={edition.id}
                layoutId={`edition-card-${edition.id}`}
                onClick={() => setSelectedEdition(edition)}
                className={`p-5 rounded-3xl bg-white border cursor-pointer hover:shadow-md transition-all ${
                  edition.isActive
                    ? "border-emerald-500 ring-2 ring-emerald-500/10"
                    : "border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                      ID: {edition.id}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-lg mt-1 tracking-tight flex items-center gap-2">
                      {edition.name}
                      <span className="text-xs font-bold text-slate-400">
                        ({edition.year})
                      </span>
                    </h4>
                    <p className="text-slate-500 font-medium text-xs mt-1.5 leading-relaxed min-h-[40px]">
                      {edition.description}
                    </p>
                  </div>

                  {edition.isActive ? (
                    <span className="shrink-0 bg-emerald-50 text-emerald-800 font-sans font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-emerald-200">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="shrink-0 bg-slate-100 text-slate-500 font-sans font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-300" /> Event Year:{" "}
                    {edition.year}
                  </span>

                  <div className="flex items-center gap-2">
                    {isAdmin && !edition.isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivateEdition(edition.id, edition.name);
                        }}
                        className="cursor-pointer text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Activate
                      </button>
                    )}

                    {isAdmin && edition.isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeactivateEdition(edition.id, edition.name);
                        }}
                        className="cursor-pointer text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Deactivate
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEdition(edition.id, edition.name);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Edition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW EDITION DETAILS MODAL */}
      <Modal
        isOpen={!!selectedEdition}
        onClose={() => setSelectedEdition(null)}
        title={selectedEdition?.name || ""}
        subtitle={
          selectedEdition
            ? `Edition Details • Scoped for ${selectedEdition.year}`
            : ""
        }
        icon={<Calendar className="w-5 h-5" />}
        maxWidth="md"
      >
        {selectedEdition && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Edition ID
                </p>
                <p className="text-sm font-mono font-bold text-slate-700 mt-1">
                  {selectedEdition.id}
                </p>
              </div>
              <div className="bg-slate-55 p-4 rounded-2xl border border-slate-200/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-1">
                  {selectedEdition.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      Draft Mode
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Description / Bio
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                {selectedEdition.description || "No description provided."}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Access Information
              </p>
              {isAdmin ? (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    You have administrator permissions. You can activate or
                    delete this edition.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>
                    This edition information is view-only. Only administrators
                    can activate or modify configurations.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-5">
              <div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      onDeleteEdition(selectedEdition.id, selectedEdition.name);
                      setSelectedEdition(null);
                    }}
                    className="cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Edition
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && !selectedEdition.isActive && (
                  <button
                    onClick={() => {
                      onActivateEdition(
                        selectedEdition.id,
                        selectedEdition.name,
                      );
                      setSelectedEdition(null);
                    }}
                    className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    🚀 Activate
                  </button>
                )}
                {isAdmin && selectedEdition.isActive && (
                  <button
                    onClick={() => {
                      onDeactivateEdition(
                        selectedEdition.id,
                        selectedEdition.name,
                      );
                      setSelectedEdition(null);
                    }}
                    className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    ⚠️ Deactivate
                  </button>
                )}
                <button
                  onClick={() => setSelectedEdition(null)}
                  className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
