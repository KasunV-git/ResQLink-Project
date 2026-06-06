import React, { useState } from "react";
import { User, Mail, Phone, Shield, LogOut, Check } from "lucide-react";

export default function Profile({ user, onUpdateProfile, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName,  setLastName]  = useState(user?.lastName  || "");
  const [phone,     setPhone]     = useState(user?.phone     || "");
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setMsg("First name and last name cannot be empty.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await onUpdateProfile({ firstName, lastName, phone });
      setIsEditing(false);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName   || "");
    setPhone(user?.phone         || "");
    setIsEditing(false);
    setMsg("");
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6" data-name="ProfilePage">

      {/* Title */}
      <div className="anim-fade-in-up flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 text-base">Manage your account information and preferences</p>
      </div>

      {/* Success / Error message */}
      {msg && (
        <div className={`text-sm font-semibold p-3 rounded-lg flex items-center gap-2 anim-fade-in ${
          msg.includes("success")
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          <Check className="w-4 h-4 flex-shrink-0" />
          {msg}
        </div>
      )}

      {/* Profile Card */}
      <div className="anim-fade-in-up d-100 bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-5 md:gap-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#15803d]" />
            <h2 className="font-semibold text-base text-slate-900">Profile Information</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">

          {/* First Name + Last Name — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={!isEditing}
                placeholder="First name"
                className="w-full bg-slate-50 border border-slate-200 disabled:border-transparent rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#15803d] focus:bg-white transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={!isEditing}
                placeholder="Last name"
                className="w-full bg-slate-50 border border-slate-200 disabled:border-transparent rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#15803d] focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
            <span className="text-slate-400 text-xs pl-0.5">Email cannot be changed</span>
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g. +1 234 567 8901"
                className="w-full bg-slate-50 border border-slate-200 disabled:border-transparent rounded-lg py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#15803d] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Account Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Role</label>
            <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50/30 rounded-lg p-2.5 w-fit">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm font-semibold">{user?.role || "Volunteer"}</span>
            </div>
          </div>

          {/* Save & Cancel */}
          {isEditing && (
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-anim bg-[#15803d] hover:bg-[#166534] text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 rounded-lg transition-colors border border-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Logout Card */}
      <div className="anim-fade-in-up d-200 bg-white border border-red-200 rounded-xl p-4 md:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-base text-slate-900">Sign Out</h3>
          <p className="text-slate-500 text-sm">Sign out of your ResQLink account</p>
        </div>
        <button
          onClick={onLogout}
          className="btn-anim inline-flex items-center gap-2 border border-red-400 hover:bg-red-50 text-red-600 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </div>
  );
}
