import React, { useState, useEffect } from "react";
import { Award, Plus, X, Save, Check, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Skills({
  currentSkills = [],
  suggestedSkills = [],
  onAddSkill,
  onRemoveSkill,
  onSaveSkills,
}) {
  const { t } = useTranslation();
  const [draftSkills, setDraftSkills] = useState(currentSkills);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sync draft skills when currentSkills from parent changes
  useEffect(() => {
    setDraftSkills(currentSkills);
  }, [currentSkills]);

  // Check if draft has unsaved changes compared to saved currentSkills
  const isDirty = (() => {
    if (draftSkills.length !== currentSkills.length) return true;
    const currentSet = new Set(currentSkills);
    return draftSkills.some((s) => !currentSet.has(s));
  })();

  const handleAddDraftSkill = (skillName) => {
    const cleaned = skillName.trim();
    if (!cleaned) return;
    if (!draftSkills.includes(cleaned)) {
      setDraftSkills((prev) => [...prev, cleaned]);
    }
  };

  const handleRemoveDraftSkill = (skillName) => {
    setDraftSkills((prev) => prev.filter((s) => s !== skillName));
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const cleaned = customSkill.trim();
    if (cleaned) {
      handleAddDraftSkill(cleaned);
      setCustomSkill("");
      setShowCustomInput(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      if (onSaveSkills) {
        await onSaveSkills(draftSkills);
      } else {
        // Fallback if onSaveSkills isn't passed
        for (const s of draftSkills) {
          if (!currentSkills.includes(s)) await onAddSkill(s);
        }
        for (const s of currentSkills) {
          if (!draftSkills.includes(s)) await onRemoveSkill(s);
        }
      }
      setFeedback({ type: "success", text: t("skills.savedSuccess") || "Skills saved successfully!" });
    } catch (err) {
      console.error("Save skills error:", err);
      setFeedback({ type: "error", text: t("skills.saveError") || "Failed to save skills. Please try again." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Remaining suggested skills (excluding draft skills)
  const availableSuggested = suggestedSkills.filter((s) => !draftSkills.includes(s));

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6" data-name="SkillsPage">
      {/* Title & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl text-slate-900 dark:text-white tracking-tight">{t("skills.title") || "My Skills"}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">{t("skills.subtitle") || "Manage your skills to get matched with relevant tasks"}</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || (!isDirty && draftSkills.length === currentSkills.length && feedback === null)}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
            isDirty
              ? "bg-[#15803d] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white ring-2 ring-[#15803d]/20 dark:ring-emerald-500/20 scale-[1.02]"
              : "bg-slate-800 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("skills.saving") || "Saving..."}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t("skills.saveSkills") || "Save Skills"}</span>
            </>
          )}
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
              : "bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {isDirty && !feedback && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-medium flex items-center justify-between">
          <span>{t("skills.unsavedChanges") || "You have unsaved changes. Click Save Skills to update database."}</span>
          <span className="bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Unsaved
          </span>
        </div>
      )}

      {/* Your Skills Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#15803d] dark:text-emerald-400" />
            <h2 className="font-semibold text-base text-slate-900 dark:text-white">
              {t("skills.yourSkills", { count: draftSkills.length }) || `Your Skills (${draftSkills.length})`}
            </h2>
          </div>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="inline-flex items-center gap-1 bg-[#15803d] hover:bg-[#166534] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("skills.addSkill") || "Add Skill"}
          </button>
        </div>

        {/* Custom Skill Inline Input Form */}
        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 max-w-md">
            <input
              type="text"
              placeholder={t("skills.enterCustom") || "Enter custom skill..."}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="flex-1 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#15803d] dark:focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#15803d] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#166534] transition-colors"
            >
              {t("skills.add") || "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t("skills.cancel") || "Cancel"}
            </button>
          </form>
        )}

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2.5 min-h-[60px] p-3 bg-slate-50/50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl items-center">
          {draftSkills.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm pl-1">{t("skills.noSkills") || "No skills added yet. Add some below!"}</p>
          ) : (
            draftSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 bg-[#15803d] dark:bg-emerald-700 text-white text-sm font-medium pl-3 pr-2 py-1 rounded-lg shadow-xs"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveDraftSkill(skill)}
                  className="hover:bg-[#166534] dark:hover:bg-emerald-800 rounded p-0.5 transition-colors"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Suggested Skills Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col gap-1 pb-2">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white">{t("skills.suggestedSkills") || "Suggested Skills"}</h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs">{t("skills.suggestedDesc") || "Click on any skill to add it to your profile"}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableSuggested.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm">{t("skills.allSuggestedAdded") || "You have added all suggested skills!"}</p>
          ) : (
            availableSuggested.map((skill) => (
              <button
                key={skill}
                onClick={() => handleAddDraftSkill(skill)}
                className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{skill}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
