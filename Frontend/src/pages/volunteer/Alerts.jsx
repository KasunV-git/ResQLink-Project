import React, { useState, useMemo } from "react";
import { Bell, X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import LocationPicker from "../../components/LocationPicker";
import { SL_DISTRICTS } from "../../data/sriLankaLocations";

const DISASTER_TYPES = [
  { key: "all",       labelKey: "alerts.types.all" },
  { key: "flood",     labelKey: "alerts.types.flood",     keywords: ["flood", "river", "water level", "low-lying", "evacuate", "kelani", "rainfall"] },
  { key: "landslide", labelKey: "alerts.types.landslide", keywords: ["landslide", "nbro", "slope", "aranayake", "meeriyabedda"] },
  { key: "cyclone",   labelKey: "alerts.types.cyclone",   keywords: ["cyclone", "storm", "bay of bengal", "wind", "fishing"] },
  { key: "tsunami",   labelKey: "alerts.types.tsunami",   keywords: ["tsunami"] },
  { key: "power",     labelKey: "alerts.types.power",     keywords: ["power outage", "electricity", "ceb", "outage"] },
];

function getAlertType(alert) {
  const text = `${alert.message} ${alert.source}`.toLowerCase();
  for (const type of DISASTER_TYPES.slice(1)) {
    if (type.keywords.some(kw => text.includes(kw))) return type.key;
  }
  return "other";
}

function alertMatchesLocation(alert, filterProvince, filterDistrict) {
  if (!filterProvince && !filterDistrict) return true;
  const text = alert.message.toLowerCase();
  if (filterDistrict) {
    return text.includes(filterDistrict.toLowerCase());
  }
  const provinceDistricts = SL_DISTRICTS
    .filter(d => d.province === filterProvince)
    .map(d => d.district.toLowerCase());
  const provinceWord = filterProvince.toLowerCase().replace(" province", "");
  return (
    provinceDistricts.some(d => text.includes(d)) ||
    text.includes(provinceWord)
  );
}

function TypePill({ type, count, active, onClick }) {
  const COLORS = {
    all:       active ? "bg-slate-800 text-white border-slate-800"       : "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
    flood:     active ? "bg-blue-600 text-white border-blue-600"         : "bg-white text-blue-600 border-blue-200 hover:border-blue-400",
    landslide: active ? "bg-amber-600 text-white border-amber-600"       : "bg-white text-amber-600 border-amber-200 hover:border-amber-400",
    cyclone:   active ? "bg-purple-600 text-white border-purple-600"     : "bg-white text-purple-600 border-purple-200 hover:border-purple-400",
    tsunami:   active ? "bg-sky-600 text-white border-sky-600"           : "bg-white text-sky-600 border-sky-200 hover:border-sky-400",
    power:     active ? "bg-yellow-500 text-white border-yellow-500"     : "bg-white text-yellow-600 border-yellow-200 hover:border-yellow-400",
  };
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
        text-xs font-semibold transition-colors whitespace-nowrap
        ${COLORS[type.key] ?? COLORS.all}
      `}
    >
      {t(type.labelKey)}
      {count > 0 && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
          ${active ? "bg-white/25" : "bg-slate-100 text-slate-600"}
        `}>
          {count}
        </span>
      )}
    </button>
  );
}

const PRIORITY_STYLE = {
  high:   { border: "border-l-red-500",     badge: "bg-red-50 text-red-700 border-red-200"     },
  medium: { border: "border-l-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  low:    { border: "border-l-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function Alerts({ alerts }) {
  const { t } = useTranslation();
  const [typeFilter,      setTypeFilter]      = useState("all");
  const [filterProvince,  setFilterProvince]  = useState("");
  const [filterDistrict,  setFilterDistrict]  = useState("");

  const typeCounts = useMemo(() => {
    const map = {};
    for (const type of DISASTER_TYPES.slice(1)) {
      map[type.key] = alerts.filter(a => getAlertType(a) === type.key).length;
    }
    return map;
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const typeMatch = typeFilter === "all" || getAlertType(a) === typeFilter;
      const locMatch  = alertMatchesLocation(a, filterProvince, filterDistrict);
      return typeMatch && locMatch;
    });
  }, [alerts, typeFilter, filterProvince, filterDistrict]);

  const hasActiveFilters = typeFilter !== "all" || filterProvince || filterDistrict;

  function clearFilters() {
    setTypeFilter("all");
    setFilterProvince("");
    setFilterDistrict("");
  }

  function handleProvinceChange(p) {
    setFilterProvince(p);
    setFilterDistrict("");
  }

  return (
    <div className="w-full flex flex-col gap-4 md:gap-5" data-name="AlertsPage">

      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl md:text-3xl text-slate-900 tracking-tight">
          {t("alerts.title")}
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          {t("alerts.subtitle")}
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm flex flex-col gap-4">

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            {t("alerts.filterAlerts")}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {t("alerts.clearFilters")}
            </button>
          )}
        </div>

        {/* Disaster type pills */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {t("alerts.disasterType")}
          </p>
          <div className="flex flex-wrap gap-2">
            {DISASTER_TYPES.map(type => (
              <TypePill
                key={type.key}
                type={type}
                count={type.key === "all" ? alerts.length : (typeCounts[type.key] ?? 0)}
                active={typeFilter === type.key}
                onClick={() => setTypeFilter(type.key)}
              />
            ))}
          </div>
        </div>

        {/* Location filter */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {t("alerts.filterByLocation")}
          </p>
          <LocationPicker
            province={filterProvince}
            district={filterDistrict}
            onProvinceChange={handleProvinceChange}
            onDistrictChange={setFilterDistrict}
            allowAll
            compact
          />
        </div>

        {/* Active filter summary */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {t("alerts.showing")}{" "}
            <span className="font-bold text-slate-700">{filteredAlerts.length}</span>
            {" "}{t("alerts.of")}{" "}
            <span className="font-bold text-slate-700">{alerts.length}</span>
            {" "}{alerts.length !== 1 ? t("alerts.alertPlural") : t("alerts.alert")}
            {hasActiveFilters && (
              <span className="ml-1.5 text-[#15803d] font-semibold">{t("alerts.filtersActive")}</span>
            )}
          </p>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5">
              {typeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {t(DISASTER_TYPES.find(t2 => t2.key === typeFilter)?.labelKey ?? "")}
                  <button onClick={() => setTypeFilter("all")} className="hover:text-red-500 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {filterDistrict && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {filterDistrict}
                  <button onClick={() => setFilterDistrict("")} className="hover:text-red-500 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {filterProvince && !filterDistrict && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {filterProvince}
                  <button onClick={() => { setFilterProvince(""); setFilterDistrict(""); }} className="hover:text-red-500 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alert list */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-sm md:text-base text-slate-900">
            {t("alerts.activeAlerts", { count: filteredAlerts.length })}
          </h2>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          {alerts.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="font-medium text-sm">{t("alerts.noAlerts")}</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-semibold text-sm text-slate-600 mb-1">{t("alerts.noMatch")}</p>
              <p className="text-xs text-slate-400">
                {t("alerts.tryRemoving")}{" "}
                <button onClick={clearFilters} className="text-[#15803d] font-semibold hover:underline">
                  {t("alerts.clearAll")}
                </button>
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const pStyle = PRIORITY_STYLE[alert.priority] ?? PRIORITY_STYLE.low;
              return (
                <div
                  key={alert.id}
                  className={`border border-slate-200 border-l-[4px] rounded-xl p-4 flex flex-col gap-3 shadow-sm transition-shadow hover:shadow-md ${pStyle.border}`}
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold px-2 py-0.5 rounded border uppercase ${pStyle.badge}`}>
                        {t("alerts.priority", { level: alert.priority })}
                      </span>
                      {getAlertType(alert) !== "other" && (
                        <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                          {t(DISASTER_TYPES.find(dt => dt.key === getAlertType(alert))?.labelKey ?? "")}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-medium">{alert.time}</span>
                  </div>

                  <p className="text-slate-900 text-sm md:text-base font-semibold leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap justify-between items-center gap-2 text-xs border-t border-slate-100 pt-2.5">
                    <span className="text-slate-400 font-medium">
                      {t("alerts.source")}{" "}
                      <span className="text-slate-600 font-semibold">{alert.source}</span>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                      {alert.target || t("alerts.forVolunteers")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
