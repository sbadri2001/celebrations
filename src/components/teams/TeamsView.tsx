import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit3,
  Mail,
  AlertCircle,
  Crown,
  Eye,
  Building,
  Award,
} from "lucide-react";
import { Team } from "../../types";
import Modal from "../common/Modal";
import { TeamService } from "../../services/teams/teamService";

interface TeamsViewProps {
  teams: Team[];
  onAddTeam: (team: Omit<Team, "id" | "dateCreated">) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (id: string, name: string) => void;
  triggerToast: (msg: string) => void;
  setTeams?: React.Dispatch<React.SetStateAction<Team[]>>;
}

// Fallback Avatars
const fallbackLogo =
  "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=150&h=150&q=80";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";

let teamsFetched = false;

export default function TeamsView({
  teams,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  triggerToast,
  setTeams,
}: TeamsViewProps) {
  useEffect(() => {
    if (setTeams && !teamsFetched) {
      teamsFetched = true;
      TeamService.getAll()
        .then((res: any) => {
          const fetchedTeams =
            (res && res.status === "SUCCESS" ? res.data : res) || [];
          setTeams(fetchedTeams);
        })
        .catch((err) => {
          console.error("Failed to load registered teams on page load:", err);
          triggerToast("Error loading active community teams.");
          // reset on error to allow retrying if they switch tabs
          teamsFetched = false;
        });
    }
  }, [setTeams]);

  // Search Query state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Visibility controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Active selected item for details/edit
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form Fields state
  const [teamName, setTeamName] = useState("");
  const [teamBlock, setTeamBlock] = useState("");
  const [teamLogoUrl, setTeamLogoUrl] = useState("");
  const [teamCaptainName, setTeamCaptainName] = useState("");
  const [teamCaptainPictureUrl, setTeamCaptainPictureUrl] = useState("");
  const [teamViceCaptainName, setTeamViceCaptainName] = useState("");
  const [teamViceCaptainPictureUrl, setTeamViceCaptainPictureUrl] =
    useState("");
  const [teamDateCreated, setTeamDateCreated] = useState("");
  const [teamEmail, setTeamEmail] = useState("");

  // Helper for handles file uploads, converting selected file to readable base64 URL
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Initializing state for Add Form
  const resetAddForm = () => {
    setTeamName("");
    setTeamBlock("AH");
    setTeamLogoUrl("");
    setTeamCaptainName("");
    setTeamCaptainPictureUrl("");
    setTeamViceCaptainName("");
    setTeamViceCaptainPictureUrl("");
    setTeamDateCreated(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    );
    setTeamEmail("team@community.com");
  };

  const handleOpenCreateModal = () => {
    resetAddForm();
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      triggerToast("Please provide a team display name.");
      return;
    }
    if (!teamBlock.trim()) {
      triggerToast("Please provide a Block division (e.g. AH).");
      return;
    }

    onAddTeam({
      name: teamName,
      block: teamBlock,
      logoUrl: teamLogoUrl || fallbackLogo,
      captainName: teamCaptainName || "TBD",
      captainPictureUrl: teamCaptainPictureUrl || fallbackAvatar,
      viceCaptainName: teamViceCaptainName || "TBD",
      viceCaptainPictureUrl: teamViceCaptainPictureUrl || fallbackAvatar,
      participantCount: 0, // Calculated / view-only
      contactEmail: teamEmail || "contact@community.org",
    });
    setIsCreateOpen(false);
  };

  const handleOpenEditModal = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation();
    setSelectedTeam(team);
    setTeamName(team.name);
    setTeamBlock(team.block || "AH");
    setTeamLogoUrl(team.logoUrl);
    setTeamCaptainName(team.captainName);
    setTeamCaptainPictureUrl(team.captainPictureUrl);
    setTeamViceCaptainName(team.viceCaptainName);
    setTeamViceCaptainPictureUrl(team.viceCaptainPictureUrl);
    setTeamDateCreated(team.dateCreated);
    setTeamEmail(team.contactEmail || "contact@community.org");
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !teamName.trim()) return;

    onUpdateTeam({
      ...selectedTeam,
      name: teamName,
      block: teamBlock,
      logoUrl: teamLogoUrl || fallbackLogo,
      captainName: teamCaptainName || "TBD",
      captainPictureUrl: teamCaptainPictureUrl || fallbackAvatar,
      viceCaptainName: teamViceCaptainName || "TBD",
      viceCaptainPictureUrl: teamViceCaptainPictureUrl || fallbackAvatar,
      participantCount: selectedTeam.participantCount, // keep existing count as it is calculated/view-only
      dateCreated: teamDateCreated || selectedTeam.dateCreated,
      contactEmail: teamEmail,
    });
    setIsEditOpen(false);
    setSelectedTeam(null);
  };

  const handleOpenViewModal = (team: Team) => {
    setSelectedTeam(team);
    setIsViewOpen(true);
  };

  // Filter & search implementation
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const search = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(search) ||
        (t.block && t.block.toLowerCase().includes(search)) ||
        t.captainName.toLowerCase().includes(search) ||
        t.viceCaptainName.toLowerCase().includes(search) ||
        (t.contactEmail && t.contactEmail.toLowerCase().includes(search))
      );
    });
  }, [teams, searchQuery]);

  return (
    <motion.div
      key="teams-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 font-sans text-slate-850"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[#a83200]" />
            Community Teams Register
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Display list, blocks alignment, key captains, vice-captains, and
            quick details.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#a83200] hover:bg-[#c03c05] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Team
        </button>
      </div>

      {/* Simplified Search Block */}
      <div className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4.5 h-4.5 text-slate-400 absolute left-8 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by team name, block (e.g. AH), captains name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#a83200] transition-all font-semibold text-slate-800"
        />
      </div>

      {/* Tabular List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/95 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6 select-none">Team Logo</th>
                <th className="py-4 px-6 select-none">Team Name</th>
                <th className="py-4 px-6 select-none">Block</th>
                <th className="py-4 px-6 select-none">Captain</th>
                <th className="py-4 px-6 select-none">Vice Captain</th>
                <th className="py-4 px-6 select-none text-center">
                  Participants
                </th>
                <th className="py-4 px-6 select-none text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeams.map((team) => (
                <tr
                  key={team.id}
                  onClick={() => handleOpenViewModal(team)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  {/* Column 1: Team Logo */}
                  <td className="py-4.5 px-6">
                    <img
                      src={team.logoUrl || fallbackLogo}
                      alt={`${team.name} Logo`}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-xs group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </td>

                  {/* Column 2: Team Name */}
                  <td className="py-4.5 px-6">
                    <div className="min-w-[120px]">
                      <span className="font-extrabold text-slate-900 group-hover:text-[#a83200] transition-colors text-base block">
                        {team.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        Est: {team.dateCreated}
                      </span>
                    </div>
                  </td>

                  {/* Column 3: Block */}
                  <td className="py-4.5 px-6">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/40 text-slate-700">
                      {team.block || "AH"}
                    </span>
                  </td>

                  {/* Column 4: Captain Name and Picture */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={team.captainPictureUrl || fallbackAvatar}
                        alt={team.captainName}
                        className="w-8 h-8 rounded-full border border-amber-300 ring-2 ring-amber-100 object-cover bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate max-w-[110px]">
                          {team.captainName}
                        </span>
                        <span className="text-[9px] text-amber-600 font-extrabold tracking-tight uppercase flex items-center gap-0.5 mt-0.5">
                          <Crown className="w-2.5 h-2.5" /> Captain
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Vice Captain Name and Picture */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={team.viceCaptainPictureUrl || fallbackAvatar}
                        alt={team.viceCaptainName}
                        className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-750 text-xs block truncate max-w-[110px]">
                          {team.viceCaptainName}
                        </span>
                        <span className="text-[9px] text-slate-450 font-extrabold tracking-tight uppercase block mt-0.5">
                          Vice Captain
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Participant Count */}
                  <td className="py-4.5 px-6 text-center">
                    <span className="inline-block bg-[#a83200]/5 text-[#a83200] font-mono font-black text-xs.5 px-2.5 py-0.5 rounded-full border border-[#a83200]/10">
                      {team.participantCount} members
                    </span>
                  </td>

                  {/* Column 7: Actions */}
                  <td
                    className="py-4.5 px-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenViewModal(team)}
                        className="p-2 text-slate-400 hover:text-[#a83200] hover:bg-slate-50 rounded-lg transition-all"
                        title="View Team Showcase Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleOpenEditModal(e, team)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                        title="Edit Team Parameters"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTeam(team.id, team.name)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-all"
                        title="Disband Team Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeams.length === 0 && (
          <div className="bg-slate-50/50 border-t border-slate-100 rounded-b-2xl p-14 text-center text-slate-500 font-medium">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold">
              No registered community teams matches "{searchQuery}".
            </p>
          </div>
        )}
      </div>

      {/* 1. VIEW TEAM SHOWCASE MODAL */}
      <Modal
        isOpen={isViewOpen && !!selectedTeam}
        onClose={() => setIsViewOpen(false)}
        title="Team Showcase Profile"
        subtitle="Active alignment, leadership & core registry parameters"
        icon={<Users className="w-5.5 h-5.5 text-[#a83200]" />}
      >
        {selectedTeam && (
          <div className="space-y-6">
            {/* Header Identity banner */}
            <div className="flex items-center gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
              <img
                src={selectedTeam.logoUrl || fallbackLogo}
                alt={`${selectedTeam.name} Logo`}
                className="w-16 h-16 rounded-2xl object-cover border shrink-0 bg-white shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap truncate">
                  {selectedTeam.name}
                </h2>
                <div className="flex items-center gap-3 text-xs font-bold mt-1 text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 tracking-tight text-[10px] font-black uppercase">
                    Block: {selectedTeam.block}
                  </span>
                  <span>•</span>
                  <span>
                    Registered:{" "}
                    <strong className="text-slate-800 font-extrabold">
                      {selectedTeam.dateCreated}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Leadership panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50/40 border border-amber-100/70 rounded-2xl flex flex-col items-center text-center">
                <img
                  src={selectedTeam.captainPictureUrl || fallbackAvatar}
                  alt={selectedTeam.captainName}
                  className="w-12 h-12 rounded-full border-2 border-amber-300 object-cover bg-white mb-2"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-0.5">
                  <Crown className="w-3 h-3 text-amber-500" /> Captain
                </span>
                <span className="text-sm font-black text-slate-850 mt-1 max-w-full truncate">
                  {selectedTeam.captainName || "N/A"}
                </span>
              </div>
              <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex flex-col items-center text-center">
                <img
                  src={selectedTeam.viceCaptainPictureUrl || fallbackAvatar}
                  alt={selectedTeam.viceCaptainName}
                  className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover bg-white mb-2"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  Vice Captain
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 max-w-full truncate">
                  {selectedTeam.viceCaptainName || "N/A"}
                </span>
              </div>
            </div>

            {/* Quick Registry Parameters */}
            <div className="space-y-3.5 bg-slate-50/70 border border-slate-200/40 rounded-2xl p-4.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5 text-slate-400">
                  <Building className="w-4 h-4 text-slate-400" /> Sector Block
                  Align:
                </span>
                <strong className="text-slate-800 font-black">
                  {selectedTeam.block}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5 text-slate-400">
                  <Users className="w-4 h-4 text-slate-400" /> Participant
                  Count:
                </span>
                <strong className="text-slate-800 font-black">
                  {selectedTeam.participantCount} active players
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" /> Date Formed:
                </span>
                <strong className="text-slate-800 font-mono font-bold">
                  {selectedTeam.dateCreated}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1.5 border-t border-slate-200/50">
                <span className="font-bold flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" /> Registrar Contact:
                </span>
                <strong className="text-[#a83200] font-mono font-bold">
                  {selectedTeam.contactEmail || "office@community.org"}
                </strong>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setIsViewOpen(false)}
              className="w-full py-3.5 text-center rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer text-sm shadow-sm"
            >
              Close Showcase Profile
            </button>
          </div>
        )}
      </Modal>

      {/* 2. CREATE TEAM MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Form Community Team"
        subtitle="Roster a new sports club, recreational group, or division team"
        icon={<Award className="w-5.5 h-5.5 text-[#a83200]" />}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3.5 mt-1">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400">
                Team Name
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Westend Strikers"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1.5 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-850"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400">
                Block (e.g., AH)
              </label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="E.g., AH"
                value={teamBlock}
                onChange={(e) => setTeamBlock(e.target.value.toUpperCase())}
                className="mt-1.5 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-850 font-mono tracking-wider"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <label className="block text-xs font-black uppercase text-slate-400">
              Team Logo
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Paste logo URL address..."
                value={teamLogoUrl}
                onChange={(e) => setTeamLogoUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#a83200] font-mono text-[11px] text-slate-800"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap">
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setTeamLogoUrl)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="border border-slate-200/60 rounded-xl p-3 bg-amber-50/10 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Captain Metadata
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Daniel Carter"
                  value={teamCaptainName}
                  onChange={(e) => setTeamCaptainName(e.target.value)}
                  className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#a83200]"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Avatar Photo
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste picture URL..."
                    value={teamCaptainPictureUrl}
                    onChange={(e) => setTeamCaptainPictureUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-none focus:border-[#a83200]"
                  />
                  <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded border border-slate-300 flex items-center justify-center cursor-pointer transition-colors whitespace-nowrap">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, setTeamCaptainPictureUrl)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/20 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Vice Captain Metadata
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Marcus Vance"
                  value={teamViceCaptainName}
                  onChange={(e) => setTeamViceCaptainName(e.target.value)}
                  className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#a83200]"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Avatar Photo
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste picture URL..."
                    value={teamViceCaptainPictureUrl}
                    onChange={(e) =>
                      setTeamViceCaptainPictureUrl(e.target.value)
                    }
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-none"
                  />
                  <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded border border-slate-300 flex items-center justify-center cursor-pointer transition-colors whitespace-nowrap">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, setTeamViceCaptainPictureUrl)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400">
              Secretary Contact Email
            </label>
            <input
              type="email"
              required
              value={teamEmail}
              onChange={(e) => setTeamEmail(e.target.value)}
              className="mt-1.5 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-xs font-semibold text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 py-3 text-center rounded-xl font-bold bg-slate-5  0 hover:bg-slate-100 border text-slate-600 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-center rounded-xl font-extrabold bg-[#a83200] text-white hover:opacity-95 text-sm cursor-pointer shadow-xs"
            >
              Save Team
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. EDIT TEAM MODAL */}
      <Modal
        isOpen={isEditOpen && !!selectedTeam}
        onClose={() => setIsEditOpen(false)}
        title="Update Team Registry Parameters"
        subtitle="Modify alignment, leadership profile photos, block or strength configuration"
        icon={<Edit3 className="w-5.5 h-5.5 text-[#a83200]" />}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3.5 mt-1">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400">
                Team Name
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1.5 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-850"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400">
                Block Alignment
              </label>
              <input
                type="text"
                required
                placeholder="E.g., AH"
                maxLength={4}
                value={teamBlock}
                onChange={(e) => setTeamBlock(e.target.value.toUpperCase())}
                className="mt-1.5 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-850 font-mono tracking-wider"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <label className="block text-xs font-black uppercase text-slate-400">
              Team Logo
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={teamLogoUrl}
                onChange={(e) => setTeamLogoUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#a83200] font-mono text-[11px] text-slate-800"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap">
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setTeamLogoUrl)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Captain section */}
          <div className="border border-slate-200/60 rounded-xl p-3 bg-amber-50/10 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Captain Profile details
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Name/Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="Capt. Name"
                  value={teamCaptainName}
                  onChange={(e) => setTeamCaptainName(e.target.value)}
                  className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#a83200]"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Avatar Photo
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    required
                    value={teamCaptainPictureUrl}
                    onChange={(e) => setTeamCaptainPictureUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-none focus:border-[#a83200]"
                  />
                  <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded border border-slate-300 flex items-center justify-center cursor-pointer transition-colors whitespace-nowrap">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, setTeamCaptainPictureUrl)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Vice-captain section */}
          <div className="border border-slate-200/60 rounded-xl p-3 bg-slate-50/20 space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Vice Captain Profile details
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Name/Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="V. Capt Name"
                  value={teamViceCaptainName}
                  onChange={(e) => setTeamViceCaptainName(e.target.value)}
                  className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#a83200]"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500">
                  Avatar Photo
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    required
                    value={teamViceCaptainPictureUrl}
                    onChange={(e) =>
                      setTeamViceCaptainPictureUrl(e.target.value)
                    }
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-none focus:border-[#a83200]"
                  />
                  <label className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded border border-slate-300 flex items-center justify-center cursor-pointer transition-colors whitespace-nowrap">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, setTeamViceCaptainPictureUrl)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400">
              Secretary Contact Email
            </label>
            <input
              type="email"
              required
              value={teamEmail}
              onChange={(e) => setTeamEmail(e.target.value)}
              className="mt-1.5 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-xs font-semibold text-slate-800"
            />
          </div>

          {/* New field: Formed Date */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-400">
              Created Date (e.g. Jun 17, 2026)
            </label>
            <input
              type="text"
              required
              value={teamDateCreated}
              onChange={(e) => setTeamDateCreated(e.target.value)}
              className="mt-1.5 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#a83200] text-sm font-semibold text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 py-3 text-center rounded-xl font-bold bg-slate-50 hover:bg-slate-100 border text-slate-600 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-center rounded-xl font-extrabold bg-[#a83200] text-white hover:opacity-95 text-sm cursor-pointer shadow-xs"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
