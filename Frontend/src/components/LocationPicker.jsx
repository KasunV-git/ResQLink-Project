/**
 * LocationPicker — reusable cascading Province → District selector
 *
 * Modes
 *  filter  (allowAll=true)  Province "All Provinces" / District "All Districts"
 *                           — used inside filter bars
 *  form    (allowAll=false) Province "Select Province" / District "Select District"
 *                           — used inside forms; district disabled until province chosen
 *
 * Compact mode (compact=true)  two dropdowns side-by-side, no labels
 * Full mode    (compact=false) stacked with bold labels
 */

import React from "react";
import { ChevronDown } from "lucide-react";
import { SL_PROVINCES, SL_DISTRICTS } from "../data/sriLankaLocations";

export default function LocationPicker({
  province       = "",
  district       = "",
  onProvinceChange,
  onDistrictChange,
  disabled       = false,
  allowAll       = true,
  compact        = false,
  className      = "",
}) {
  // Cascade: only show districts belonging to the chosen province
  const availableDistricts = province
    ? SL_DISTRICTS.filter(d => d.province === province)
    : SL_DISTRICTS;

  function handleProvince(e) {
    onProvinceChange(e.target.value);
    onDistrictChange("");          // always reset district on province change
  }

  // Base Tailwind classes shared by both selects
  const selectClass = [
    "w-full bg-slate-50 border border-slate-200 rounded-lg",
    "text-sm font-medium text-slate-700",
    "appearance-none cursor-pointer transition-colors",
    "focus:outline-none focus:border-[#15803d] focus:bg-white",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100",
    compact ? "py-2 pl-3 pr-8" : "py-2.5 pl-3 pr-8",
  ].join(" ");

  return (
    <div
      className={[
        "flex",
        compact ? "flex-row items-center gap-2" : "flex-col gap-3",
        className,
      ].join(" ")}
    >
      {/* ── Province ── */}
      <div className={compact ? "relative flex-1" : "flex flex-col gap-1.5"}>
        {!compact && (
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Province
          </label>
        )}
        <div className="relative">
          <select
            value={province}
            onChange={handleProvince}
            disabled={disabled}
            className={selectClass}
          >
            <option value="">
              {allowAll ? "All Provinces" : "Select Province"}
            </option>
            {SL_PROVINCES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* ── District ── */}
      <div className={compact ? "relative flex-1" : "flex flex-col gap-1.5"}>
        {!compact && (
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            District
          </label>
        )}
        <div className="relative">
          <select
            value={district}
            onChange={e => onDistrictChange(e.target.value)}
            // In form mode, lock district until a province is selected
            disabled={disabled || (!allowAll && !province)}
            className={selectClass}
          >
            <option value="">
              {allowAll
                ? "All Districts"
                : province
                  ? "Select District"
                  : "Select a province first"}
            </option>
            {availableDistricts.map(d => (
              <option key={d.district} value={d.district}>{d.district}</option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
