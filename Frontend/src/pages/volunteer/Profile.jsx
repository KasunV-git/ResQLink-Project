import { useState } from "react";
import { User, Mail, Phone, Shield, LogOut, Check } from "lucide-react";

export default function Profile({ user, onUpdateProfile, onLogout, isDarkMode }) {
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

  const textHeading = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";

  return (
    <div className="w-full flex flex-col gap-6" data-name="ProfilePage">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>My Profile</h1>
        <p className={`text-base transition-colors ${textMuted}`}>Manage your account information and preferences</p>
      </div>

      {msg && (
        <div className={`text-sm font-semibold p-3 border rounded-lg flex items-center gap-2 ${
          isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-100"
        }`}>
          <Check className="w-4 h-4" />
          {msg}
        </div>
      )}

      {/* Profile Form Card */}
      <div className={`border rounded-xl p-6 shadow-sm flex flex-col gap-6 transition-colors ${cardBg}`}>
        <div className={`flex justify-between items-center pb-2 border-b ${borderMuted}`}>
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#15803d]" />
            <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Profile Information</h2>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={`border text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors cursor-pointer ${
                isDarkMode 
                  ? "border-slate-850 text-slate-350 bg-slate-950 hover:bg-slate-800" 
                  : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
              }`}
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-800"}`}>Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`w-full border disabled:border-transparent rounded-lg py-2 pl-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#15803d]"
                }`}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-800"}`}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={user?.email || "volunteer@resqlink.com"}
                disabled
                className={`w-full border rounded-lg py-2 pl-9 pr-3 text-sm font-medium cursor-not-allowed ${
                  isDarkMode ? "bg-slate-950 border-slate-800 text-slate-450" : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              />
            </div>
            <span className="text-slate-400 text-xs pl-0.5">Email cannot be changed</span>
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-800"}`}>Contact Number</label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={`w-full border disabled:border-transparent rounded-lg py-2 pl-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#15803d]"
                }`}
              />
              <Phone className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Account Role */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-800"}`}>Account Role</label>
            <div className={`flex items-center gap-2 rounded-lg p-2.5 max-w-sm border ${
              isDarkMode 
                ? "border-emerald-900/40 bg-emerald-950/20" 
                : "border-emerald-100 bg-emerald-50/20"
            }`}>
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold">{user?.role || "Volunteer"}</span>
            </div>
          </div>

          {/* Save & Cancel Actions */}
          {isEditing && (
            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
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
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors border cursor-pointer ${
                  isDarkMode 
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750" 
                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Logout Card */}
      <div className={`border rounded-xl p-6 shadow-sm flex items-center justify-between mt-2 transition-colors ${
        isDarkMode ? "bg-slate-900 border-red-500/20 text-white" : "bg-white border-red-200 text-slate-900"
      }`}>
        <div className="flex flex-col gap-1">
          <h3 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Sign Out</h3>
          <p className={`text-sm ${textMuted}`}>Sign out of your ResQLink account</p>
        </div>
        <button
          onClick={onLogout}
          className={`inline-flex items-center gap-2 border text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-all cursor-pointer ${
            isDarkMode 
              ? "border-red-500/30 hover:bg-red-500/10 text-red-400 bg-slate-950" 
              : "border-red-500 hover:bg-red-55 text-red-650 bg-white"
          }`}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
