"use client";

import React, { useState, useEffect } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role: string;
    image: string;
    phone: string;
    bio: string;
    school: string;
    department: string;
    country: string;
    poafId: string;
    ratingScore: number;
    ratingStrength: string;
    ratingNotes: string;
  }>({
    name: "",
    email: "",
    role: "",
    image: "",
    phone: "",
    bio: "",
    school: "",
    department: "",
    country: "",
    poafId: "",
    ratingScore: 85,
    ratingStrength: "Pioneer Innovator",
    ratingNotes: ""
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            const u = data.user;
            const m = u.member || {};
            setProfile({
              name: u.name || `${m.firstName || ""} ${m.lastName || ""}`.trim() || "Pioneer",
              email: u.email || "",
              role: u.role || m.role || "Member",
              image: u.image || m.photoUrl || "/images/media_1787222340022.png",
              phone: m.phone || "",
              bio: m.bio || "",
              school: m.school || "",
              department: m.department || "General Division",
              country: m.country || "Pan-Africa",
              poafId: m.poafId || "POAF-MEM-VERIFIED",
              ratingScore: m.ratingScore || 88,
              ratingStrength: m.ratingStrength || "Grassroots Problem Solving",
              ratingNotes: m.ratingNotes || "Consistent contributor in team projects"
            });
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          school: profile.school,
          photoUrl: profile.image
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Profile saved successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
          window.location.reload();
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const avatarOptions = [
    "/images/media_1787222340022.png",
    "/images/media_1787225249810.png",
    "/images/media_1787223395009.png",
    "/images/media_1787224434429.jpg",
    "/images/media_1787223249571.jpg"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
              Identity & Settings
            </span>
            <h2 className="text-xl font-black mt-1">Pioneer Profile Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">
              Loading pioneer identity profile...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Card Header */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div 
                  className="w-20 h-20 rounded-2xl bg-cover bg-center shadow-lg border-2 border-blue-500 shrink-0"
                  style={{ backgroundImage: `url('${profile.image}')` }}
                />
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">
                      {profile.poafId}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded uppercase border border-emerald-800">
                      {profile.role}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{profile.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{profile.department} • {profile.country}</p>
                </div>
              </div>

              {/* Student Performance Rating Badge */}
              <div className="bg-gradient-to-r from-blue-950 to-indigo-950 p-4 rounded-2xl border border-blue-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-300">Department Performance Score</span>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{profile.ratingStrength}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">{profile.ratingScore}<span className="text-xs text-slate-400">/100</span></div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">Verified Good Standing</span>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Avatar Photo
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfile({ ...profile, image: avatar })}
                      className={`w-12 h-12 rounded-xl bg-cover bg-center border-2 transition ${
                        profile.image === avatar ? "border-blue-500 scale-105 shadow-md" : "border-slate-700 hover:border-slate-500"
                      }`}
                      style={{ backgroundImage: `url('${avatar}')` }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom image URL"
                  value={profile.image}
                  onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email (Primary Identity)
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+251 900 000000"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    School / University
                  </label>
                  <input
                    type="text"
                    placeholder="Addis Ababa University / secondary school"
                    value={profile.school}
                    onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Bio / Information About Yourself
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell your fellow pioneers about your passions, academic interests, and continental vision..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl text-center">
                  {successMsg}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
