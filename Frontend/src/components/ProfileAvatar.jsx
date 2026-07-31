import React, { useState } from "react";
import { User, Camera } from "lucide-react";

/**
 * Reusable ProfileAvatar Component
 * 
 * Props:
 * - user: User object containing firstName, lastName, name, avatarUrl
 * - avatarUrl: Explicit image URL (overrides user.avatarUrl if provided)
 * - size: "sm" (32px), "md" (40px), "lg" (64px), "xl" (96px), "2xl" (112px)
 * - editable: Boolean - shows camera edit icon overlay on hover
 * - onClick: Click handler when avatar or edit button is clicked
 * - className: Custom container classes
 * - altText: Alt attribute for image
 */
export default function ProfileAvatar({
  user,
  avatarUrl: explicitAvatarUrl,
  size = "md",
  editable = false,
  onClick,
  className = "",
  altText,
}) {
  const [imageError, setImageError] = useState(false);

  // Determine avatar URL from explicit prop or user object
  const rawUrl = explicitAvatarUrl ?? user?.avatarUrl;

  // Resolve full image URL (handle relative /uploads path from backend)
  const resolvedUrl = (() => {
    if (!rawUrl || imageError) return null;
    if (rawUrl.startsWith("data:") || rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }
    // Relative path from Express backend
    return `http://localhost:5000${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  })();

  // Compute initials (e.g. "Kamal Perera" -> "KP")
  const initials = (() => {
    const fn = user?.firstName || "";
    const ln = user?.lastName  || "";
    if (fn || ln) {
      return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const parts = user.name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
      }
      return parts[0].charAt(0).toUpperCase();
    }
    return null;
  })();

  // Size mappings
  const SIZE_MAP = {
    sm:  "w-8 h-8 text-xs ring-1",
    md:  "w-10 h-10 text-sm ring-2",
    lg:  "w-16 h-16 text-xl ring-2",
    xl:  "w-24 h-24 text-2xl ring-4",
    "2xl": "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-2xl sm:text-3xl ring-4",
  };

  const ICON_SIZE_MAP = {
    sm: 14,
    md: 18,
    lg: 28,
    xl: 36,
    "2xl": 44,
  };

  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;
  const iconSize = ICON_SIZE_MAP[size] || 18;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full flex-shrink-0 transition-all ${
        editable ? "cursor-pointer group" : ""
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-full flex items-center justify-center font-bold tracking-wider shadow-md ring-emerald-500/20 dark:ring-emerald-400/30 transition-transform duration-200 ${
          editable ? "group-hover:scale-[1.02]" : ""
        } ${sizeClasses}`}
      >
        {resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt={altText || user?.name || "User profile image"}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center select-none">
            {initials ? (
              <span>{initials}</span>
            ) : (
              <User size={iconSize} className="opacity-90" />
            )}
          </div>
        )}

        {/* Hover overlay when editable */}
        {editable && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera className="w-5 h-5 md:w-6 md:h-6 drop-shadow-md animate-scale-in" />
          </div>
        )}
      </div>

      {/* Camera badge when editable */}
      {editable && (
        <button
          type="button"
          aria-label="Edit Profile Image"
          className="absolute bottom-0 right-0 p-1.5 md:p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md border-2 border-white dark:border-slate-900 transition-transform active:scale-95 group-hover:scale-110"
        >
          <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      )}
    </div>
  );
}
