import React, { useState } from "react";
import { User, Mail, Phone, Shield, LogOut, Check } from "lucide-react";

export default function Profile({ user, onUpdateProfile, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    try {
      await onUpdateProfile({ name, phone });
      setIsEditing(false);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" data-name="ProfilePage">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-base">Manage your account information and preferences</p>
      </div>

      {msg && (
        <div className="text-sm font-semibold p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          {msg}
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#15803d]" />
            <h2 className="font-semibold text-base text-slate-900">Profile Information</h2>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-slate-50 border border-slate-200 disabled:border-transparent rounded-lg py-2 pl-3 pr-10 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#15803d] focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || "volunteer@resqlink.com"}
                disabled
                className="w-full bg-slate-50/50 border border-transparent rounded-lg py-2 pl-3 pr-10 text-sm font-medium text-slate-400 cursor-not-allowed"
              />
              <Mail className="absolute right-3 top-2.5 w-4 h-4 text-slate-300" />
            </div>
            <span className="text-slate-400 text-xs pl-0.5">Email cannot be changed</span>
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact Number</label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-slate-50 border border-slate-200 disabled:border-transparent rounded-lg py-2 pl-3 pr-10 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#15803d] focus:bg-white transition-colors"
              />
              <Phone className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Account Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Account Role</label>
            <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50/20 rounded-lg p-2.5 max-w-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-semibold">{user?.role || "Volunteer"}</span>
            </div>
          </div>

          {/* Save & Cancel Actions */}
          {isEditing && (
            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setName(user?.name || "");
                  setPhone(user?.phone || "");
                  setIsEditing(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Logout Card */}
      <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-base text-slate-900">Sign Out</h3>
          <p className="text-slate-500 text-sm">Sign out of your ResQLink account</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 border border-red-500 hover:bg-red-50 text-red-600 text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
