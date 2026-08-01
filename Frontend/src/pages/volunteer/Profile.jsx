import React, { useState, useRef } from "react";
import { User, Mail, Phone, Shield, LogOut, Check, Upload, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SL_PHONE_PLACEHOLDER } from "../../data/sriLankaLocations";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function Profile({ user, onUpdateProfile, onLogout, isDarkMode }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setFirstName]     = useState(user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "");
  const [phone, setPhone]         = useState(user?.phone || "");
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState("");
  const [msgType, setMsgType]     = useState("success");

  // Avatar state
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isRemoving, setIsRemoving]       = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError]     = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg(t("profile.validationMsg") || "Name cannot be empty.");
      setMsgType("error");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await onUpdateProfile({ name, phone });
      setIsEditing(false);
      setMsg(t("profile.successMsg") || "Profile updated successfully!");
      setMsgType("success");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setMsg(t("profile.errorMsg") || "Failed to update profile.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "");
    setPhone(user?.phone || "");
    setIsEditing(false);
    setMsg("");
  };

  const handleFileSelect = (e) => {
    setAvatarError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setAvatarError("Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAvatarError("File size exceeds 5MB limit. Please choose a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewAvatar(event.target.result);
      setIsRemoving(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!previewAvatar && !isRemoving) return;
    setAvatarLoading(true);
    setAvatarError("");
    try {
      if (isRemoving) {
        await onUpdateProfile({ avatarUrl: null });
      } else {
        await onUpdateProfile({ avatarUrl: previewAvatar });
      }
      setPreviewAvatar(null);
      setIsRemoving(false);
      setMsg("Profile image updated successfully!");
      setMsgType("success");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setAvatarError("Failed to update profile image. Please try again.");
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewAvatar(null);
    setIsRemoving(true);
    setAvatarError("");
  };

  const handleCancelAvatar = () => {
    setPreviewAvatar(null);
    setIsRemoving(false);
    setAvatarError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentDisplayAvatar = isRemoving ? null : (previewAvatar || user?.avatarUrl);

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6" data-name="ProfilePage">

      {/* Title */}
      <div className="anim-fade-in-up flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 dark:text-white tracking-tight">{t("profile.title") || "My Profile"}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">{t("profile.subtitle") || "Manage your account information and preferences"}</p>
      </div>

      {/* Success / Error message banner */}
      {msg && (
        <div className={`text-sm font-semibold p-3.5 rounded-xl flex items-center gap-2 anim-fade-in ${
          msgType === "success"
            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
            : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60"
        }`}>
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* ── Avatar Management Header Card ── */}
      <div className="anim-fade-in-up bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6">
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <ProfileAvatar
          user={user}
          avatarUrl={currentDisplayAvatar}
          size="2xl"
          editable
          onClick={() => fileInputRef.current?.click()}
          altText={`${user?.name || "User"}'s profile image`}
        />

        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user?.name || name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {user?.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
              <Shield className="w-3.5 h-3.5" />
              {user?.role || "Volunteer"}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              user?.isAvailable
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}>
              <span className={`w-2 h-2 rounded-full ${user?.isAvailable ? "bg-emerald-500" : "bg-slate-400"}`} />
              {user?.isAvailable ? "Available for Dispatch" : "Unavailable"}
            </span>
          </div>

          {avatarError && (
            <div className="w-full mt-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
              <span>{avatarError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 w-full">
            {(previewAvatar || isRemoving) ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={avatarLoading}
                  className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {avatarLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Avatar</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAvatar}
                  disabled={avatarLoading}
                  className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Upload Image</span>
                </button>

                {(user?.avatarUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Supports JPG, JPEG, PNG, or WEBP (Max 5MB)
          </p>
        </div>
      </div>

      {/* Profile Info Form Card */}
      <div className="anim-fade-in-up d-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col gap-5 md:gap-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#15803d] dark:text-emerald-400" />
            <h2 className="font-semibold text-base text-slate-900 dark:text-white">{t("profile.profileInfo") || "Profile Information"}</h2>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs transition-colors"
            >
              {t("profile.editProfile") || "Edit Profile"}
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("profile.fullName") || "Full Name"}</label>
            <input
              type="text"
              value={name}
              onChange={e => setFirstName(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your name"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:border-transparent rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#15803d] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("profile.emailAddress") || "Email Address"}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg py-2.5 pl-9 pr-3 text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
            <span className="text-slate-400 dark:text-slate-500 text-xs pl-0.5">{t("profile.emailCannotChange") || "Email cannot be changed"}</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("profile.mobileNumber") || "Contact Number"}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder={SL_PHONE_PLACEHOLDER}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:border-transparent rounded-lg py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#15803d] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("profile.accountRole") || "Account Role"}</label>
            <div className="flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/40 rounded-lg p-2.5 w-fit">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold">{user?.role || "Volunteer"}</span>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-anim bg-[#15803d] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-xs transition-colors"
              >
                {loading ? (t("profile.saving") || "Saving...") : (t("profile.saveChanges") || "Save Changes")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold px-5 py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              >
                {t("profile.cancel") || "Cancel"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Logout Card */}
      <div className="anim-fade-in-up d-200 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">{t("profile.signOut") || "Sign Out"}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("profile.signOutDesc") || "Sign out of your ResQLink account"}</p>
        </div>
        <button
          onClick={onLogout}
          className="btn-anim inline-flex items-center gap-2 border border-red-400 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-semibold py-2 px-4 rounded-xl shadow-xs transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t("profile.logout") || "Logout"}
        </button>
      </div>
    </div>
  );
}
