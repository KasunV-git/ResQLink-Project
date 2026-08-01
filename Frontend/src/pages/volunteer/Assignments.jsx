import React, { useState, useCallback, useMemo } from "react";
import {
  Check, MapPin, CheckCircle2, Play,
  Loader2, AlertCircle, ChevronRight,
  ClipboardList, Zap, Trophy, Filter, X, ClipboardCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LocationPicker from "../../components/LocationPicker";
import { SL_DISTRICTS } from "../../data/sriLankaLocations";

function extractDistrict(location) {
  if (!location) return null;
  const locLower = location.toLowerCase();
  const found = SL_DISTRICTS.find(d =>
    locLower.includes(d.district.toLowerCase())
  );
  return found?.district ?? null;
}

function locationMatchesFilter(location, filterProvince, filterDistrict) {
  if (!filterProvince && !filterDistrict) return true;
  const locLower = location?.toLowerCase() ?? "";
  if (filterDistrict) {
    return locLower.includes(filterDistrict.toLowerCase());
  }
  const provinceDistricts = SL_DISTRICTS
    .filter(d => d.province === filterProvince)
    .map(d => d.district.toLowerCase());
  const provinceWord = filterProvince.toLowerCase().replace(" province", "");
  return (
    provinceDistricts.some(d => locLower.includes(d)) ||
    locLower.includes(provinceWord)
  );
}

/* ── Status badge maps ── */
const BADGE = {
  "assigned":    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  "in-progress": "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60",
  "completed":   "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60",
};
const BADGE_DOT = {
  "assigned":    "bg-slate-400 dark:bg-slate-500",
  "in-progress": "bg-amber-500",
  "completed":   "bg-emerald-500",
};

/* ── Pipeline bar ── */
function PipelineBar({ counts }) {
  const { t } = useTranslation();
  const stages = [
    { labelKey: "assignments.sections.assigned",   fallback: "Assigned",    value: counts.assigned,   active: counts.assigned   > 0, numColor: "text-sky-700 dark:text-sky-400",     bg: counts.assigned   > 0 ? "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/60"     : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800" },
    { labelKey: "assignments.sections.inProgress", fallback: "In Progress", value: counts.inProgress, active: counts.inProgress > 0, numColor: "text-amber-700 dark:text-amber-400",   bg: counts.inProgress > 0 ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60"   : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800" },
    { labelKey: "assignments.sections.completed",  fallback: "Completed",   value: counts.completed,  active: counts.completed  > 0, numColor: "text-emerald-700 dark:text-emerald-400", bg: counts.completed  > 0 ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60": "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 md:px-6 py-4 shadow-xs">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
        {t("assignments.taskLifecycle") || "Task Lifecycle Pipeline"}
      </p>
      <div className="flex items-center gap-1 md:gap-2">
        {stages.map((s, i) => (
          <React.Fragment key={s.labelKey}>
            <div className={`flex-1 flex flex-col items-center gap-1 border rounded-xl py-2.5 px-2 transition-colors ${s.bg}`}>
              <span className={`text-xl md:text-2xl font-bold leading-none ${s.active ? s.numColor : "text-slate-400 dark:text-slate-500"}`}>
                {s.value}
              </span>
              <span className={`text-[10px] md:text-xs font-semibold text-center leading-tight ${s.active ? s.numColor : "text-slate-400 dark:text-slate-500"}`}>
                {t(s.labelKey) || s.fallback}
              </span>
            </div>
            {i < stages.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Action button ── */
function ActionButton({ sectionStatus, id, isLoading, onStart, onComplete }) {
  const { t } = useTranslation();
  if (sectionStatus === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-1.5 px-2">
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden sm:inline">{t("assignments.done") || "Completed"}</span>
      </span>
    );
  }
  if (sectionStatus === "assigned") {
    return (
      <button
        disabled={isLoading}
        onClick={() => onStart ? onStart(id) : onComplete(id)}
        className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   text-white text-xs font-semibold py-1.5 px-3 rounded-lg
                   shadow-xs transition-colors whitespace-nowrap"
      >
        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
        <span>{isLoading ? (t("assignments.starting") || "Starting...") : (t("assignments.startTask") || "Start Task")}</span>
      </button>
    );
  }
  return (
    <button
      disabled={isLoading}
      onClick={() => onComplete(id)}
      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600
                 disabled:opacity-50 disabled:cursor-not-allowed
                 text-white text-xs font-semibold py-1.5 px-3 rounded-lg
                 shadow-xs transition-colors whitespace-nowrap"
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      <span>{isLoading ? (t("assignments.saving") || "Saving...") : (t("assignments.markComplete") || "Complete")}</span>
    </button>
  );
}

function DistrictBadge({ location }) {
  const district = extractDistrict(location);
  if (!district) return null;
  return (
    <span className="inline-flex items-center text-[9px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 px-1.5 py-0.5 rounded-full whitespace-nowrap">
      {district}
    </span>
  );
}

function TaskRow({ item, section, isLoading, errorMsg, onStart, onComplete }) {
  const { t } = useTranslation();
  const date = item[section.dateField];

  return (
    <>
      <tr className={`text-sm transition-colors ${section.rowHover} ${
        section.status === "completed" ? "opacity-65" : ""
      }`}>
        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
          <span className="block max-w-[150px] truncate" title={item.disaster}>
            {item.disaster}
          </span>
        </td>
        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-normal">
          <span className="block max-w-[200px] truncate" title={item.task}>
            {item.task}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-normal">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span className="truncate max-w-[140px]" title={item.location}>
                {item.location}
              </span>
            </span>
            <DistrictBadge location={item.location} />
          </div>
        </td>
        <td className="px-5 py-3.5 text-center">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t(section.dateLabelKey) || "Date"}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{date || "—"}</span>
          </div>
        </td>
        <td className="px-5 py-3.5 text-right">
          <ActionButton
            sectionStatus={section.status}
            id={item.id}
            isLoading={isLoading}
            onStart={onStart}
            onComplete={onComplete}
          />
        </td>
      </tr>
      {errorMsg && (
        <tr className="bg-red-50 dark:bg-red-950/40">
          <td colSpan={5} className="px-5 py-2">
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errorMsg}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

function TaskCard({ item, section, isLoading, errorMsg, onStart, onComplete }) {
  const { t } = useTranslation();
  const date     = item[section.dateField];
  const district = extractDistrict(item.location);

  const BADGE_LABEL = {
    "assigned":    t("assignments.badge.assigned") || "Assigned",
    "in-progress": t("assignments.badge.inProgress") || "In Progress",
    "completed":   t("assignments.badge.completed") || "Completed",
  };

  return (
    <div className={`p-4 ${section.status === "completed" ? "opacity-65" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-slate-900 dark:text-white leading-snug truncate">
            {item.disaster}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
            {item.task}
          </p>
        </div>
        <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${BADGE[item.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${BADGE_DOT[item.status]}`} />
          {BADGE_LABEL[item.status]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {item.location}
        </span>
        {district && <DistrictBadge location={item.location} />}
        <span>·</span>
        <span>
          {t(section.dateLabelKey) || "Date"}:{" "}
          <span className="text-slate-500 dark:text-slate-400 font-medium">{date || "—"}</span>
        </span>
      </div>
      <ActionButton
        sectionStatus={section.status}
        id={item.id}
        isLoading={isLoading}
        onStart={onStart}
        onComplete={onComplete}
      />
      {errorMsg && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}

function TaskSection({ section, tasks, loadingId, rowError, onStart, onComplete }) {
  const { t } = useTranslation();
  const { Icon } = section;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      <div className={`flex items-center justify-between gap-3 px-4 md:px-5 py-3 md:py-3.5 border-b ${section.headerBg} ${section.headerBorder}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 flex-shrink-0 ${section.iconColor}`} />
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
              {t(section.titleKey) || section.fallbackTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">
              {t(section.subtitleKey) || section.fallbackSubtitle}
            </p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full text-white ${section.countBg}`}>
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{t(section.emptyTextKey) || "No tasks in this stage"}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-2.5">{t("assignments.disaster") || "Disaster"}</th>
                  <th className="px-5 py-2.5">{t("assignments.task") || "Task"}</th>
                  <th className="px-5 py-2.5">{t("assignments.location") || "Location"}</th>
                  <th className="px-5 py-2.5 text-center">{t(section.dateLabelKey) || "Date"}</th>
                  <th className="px-5 py-2.5 text-right">{t("assignments.action") || "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.map(item => (
                  <TaskRow
                    key={item.id}
                    item={item}
                    section={section}
                    isLoading={loadingId === item.id}
                    errorMsg={rowError?.id === item.id ? rowError.message : null}
                    onStart={onStart}
                    onComplete={onComplete}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.map(item => (
              <TaskCard
                key={item.id}
                item={item}
                section={section}
                isLoading={loadingId === item.id}
                errorMsg={rowError?.id === item.id ? rowError.message : null}
                onStart={onStart}
                onComplete={onComplete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const SECTIONS = [
  {
    status:           "assigned",
    titleKey:         "assignments.sections.assigned",
    fallbackTitle:    "Assigned Tasks",
    subtitleKey:      "assignments.sections.assignedSubtitle",
    fallbackSubtitle: "Tasks assigned to you awaiting acceptance",
    emptyTextKey:     "assignments.emptyText.assigned",
    dateLabelKey:     "assignments.dateLabel.assigned",
    dateField:        "assignedDate",
    Icon:             ClipboardList,
    headerBg:         "bg-slate-50 dark:bg-slate-800/60",
    headerBorder:     "border-slate-200 dark:border-slate-800",
    iconColor:        "text-sky-600 dark:text-sky-400",
    countBg:          "bg-sky-600",
    rowHover:         "hover:bg-sky-50/40 dark:hover:bg-sky-950/30",
  },
  {
    status:           "in-progress",
    titleKey:         "assignments.sections.inProgress",
    fallbackTitle:    "In Progress Tasks",
    subtitleKey:      "assignments.sections.inProgressSubtitle",
    fallbackSubtitle: "Active tasks currently underway",
    emptyTextKey:     "assignments.emptyText.inProgress",
    dateLabelKey:     "assignments.dateLabel.assigned",
    dateField:        "assignedDate",
    Icon:             Zap,
    headerBg:         "bg-amber-50/60 dark:bg-amber-950/30",
    headerBorder:     "border-amber-200 dark:border-amber-900/40",
    iconColor:        "text-amber-600 dark:text-amber-400",
    countBg:          "bg-amber-500",
    rowHover:         "hover:bg-amber-50/40 dark:hover:bg-amber-950/30",
  },
  {
    status:           "completed",
    titleKey:         "assignments.sections.completed",
    fallbackTitle:    "Completed Assignments",
    subtitleKey:      "assignments.sections.completedSubtitle",
    fallbackSubtitle: "Tasks successfully completed and verified",
    emptyTextKey:     "assignments.emptyText.completed",
    dateLabelKey:     "assignments.dateLabel.completed",
    dateField:        "completedDate",
    Icon:             Trophy,
    headerBg:         "bg-emerald-50/60 dark:bg-emerald-950/30",
    headerBorder:     "border-emerald-200 dark:border-emerald-900/40",
    iconColor:        "text-emerald-600 dark:text-emerald-400",
    countBg:          "bg-emerald-600",
    rowHover:         "",
  },
];

export default function Assignments({
  assignments = [],
  activeAssignments,
  completedAssignments,
  onStartAssignment,
  onCompleteAssignment
}) {
  const { t } = useTranslation();
  const [loadingId,      setLoadingId]      = useState(null);
  const [rowError,       setRowError]       = useState(null);
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");

  const allAssignments = useMemo(() => {
    if (assignments && assignments.length > 0) return assignments;
    const active = activeAssignments || [];
    const completed = completedAssignments || [];
    return [...active, ...completed];
  }, [assignments, activeAssignments, completedAssignments]);

  const clearError = useCallback((id) => {
    setTimeout(() => setRowError(prev => (prev?.id === id ? null : prev)), 4000);
  }, []);

  const handleStart = async (id) => {
    if (loadingId !== null) return;
    setLoadingId(id);
    setRowError(null);
    try {
      if (onStartAssignment) {
        await onStartAssignment(id);
      }
    } catch (err) {
      setRowError({ id, message: err?.message || "Failed to start task." });
      clearError(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleComplete = async (id) => {
    if (loadingId !== null) return;
    setLoadingId(id);
    setRowError(null);
    try {
      if (onCompleteAssignment) {
        await onCompleteAssignment(id);
      }
    } catch (err) {
      setRowError({ id, message: err?.message || "Failed to complete task." });
      clearError(id);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredAssignments = useMemo(() => {
    if (!filterProvince && !filterDistrict) return allAssignments;
    return allAssignments.filter(a =>
      locationMatchesFilter(a.location, filterProvince, filterDistrict)
    );
  }, [allAssignments, filterProvince, filterDistrict]);

  const hasLocationFilter = Boolean(filterProvince || filterDistrict);

  function handleProvinceChange(p) {
    setFilterProvince(p);
    setFilterDistrict("");
  }

  function clearLocationFilter() {
    setFilterProvince("");
    setFilterDistrict("");
  }

  const buckets = {
    "assigned":    filteredAssignments.filter(a => a.status === "assigned"),
    "in-progress": filteredAssignments.filter(a => a.status === "in-progress"),
    "completed":   filteredAssignments.filter(a => a.status === "completed"),
  };

  const counts = {
    assigned:   buckets["assigned"].length,
    inProgress: buckets["in-progress"].length,
    completed:  buckets["completed"].length,
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-5" data-name="AssignmentsPage">

      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">
          {t("assignments.title") || "My Assignments"}
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          {t("assignments.subtitle") || "View and manage your volunteer tasks"}
        </p>
      </div>

      <PipelineBar counts={counts} />

      {/* Location filter bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 md:px-5 py-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {t("assignments.filterByLocation") || "Filter by Location"}
          </div>
          {hasLocationFilter && (
            <button
              onClick={clearLocationFilter}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3 h-3" />
              {t("assignments.clear") || "Clear"}
            </button>
          )}
        </div>

        <LocationPicker
          province={filterProvince}
          district={filterDistrict}
          onProvinceChange={handleProvinceChange}
          onDistrictChange={setFilterDistrict}
          allowAll
          compact
        />

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {t("assignments.showing") || "Showing"}{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">{filteredAssignments.length}</span>
          {" "}{t("assignments.of") || "of"}{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">{allAssignments.length}</span>
          {" "}{allAssignments.length !== 1 ? (t("assignments.assignments") || "assignments") : (t("assignments.assignment") || "assignment")}
          {hasLocationFilter && (
            <>
              {" "}{t("assignments.in") || "in"}{" "}
              <span className="font-semibold text-[#15803d] dark:text-emerald-400">
                {filterDistrict || filterProvince}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Sections or empty states */}
      {allAssignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-12 flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-200 dark:text-slate-700" />
          <div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">{t("assignments.noAssignmentsYet") || "No assignments yet"}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              {t("assignments.noAssignmentsDesc") || "All caught up! New disaster response tasks will appear here."}
            </p>
          </div>
        </div>
      ) : (
        SECTIONS.map(section => (
          <TaskSection
            key={section.status}
            section={section}
            tasks={buckets[section.status] ?? []}
            loadingId={loadingId}
            rowError={rowError}
            onStart={handleStart}
            onComplete={handleComplete}
          />
        ))
      )}

    </div>
  );
}
