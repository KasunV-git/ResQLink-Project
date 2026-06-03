import { useState } from "react";
import { Award, Plus, X } from "lucide-react";

export default function Skills({ currentSkills, suggestedSkills, onAddSkill, onRemoveSkill }) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const cleaned = customSkill.trim();
    if (cleaned) {
      onAddSkill(cleaned);
      setCustomSkill("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" data-name="SkillsPage">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">My Skills</h1>
        <p className="text-slate-500 text-base">Manage your skills to get matched with relevant tasks</p>
      </div>

      {/* Your Skills Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#15803d]" />
            <h2 className="font-semibold text-base text-slate-900">
              Your Skills ({currentSkills.length})
            </h2>
          </div>
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="inline-flex items-center gap-1 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skill
          </button>
        </div>

        {/* Custom Skill Inline Input Form */}
        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="flex gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 max-w-md">
            <input
              type="text"
              placeholder="Enter custom skill..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="flex-1 text-sm bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-[#15803d]"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#15803d] text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-[#166534] transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="bg-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2.5 min-h-[60px] p-2 bg-slate-50/30 border border-dashed border-slate-200 rounded-lg items-center">
          {currentSkills.length === 0 ? (
            <p className="text-slate-400 text-sm pl-2">No skills added yet. Add some below!</p>
          ) : (
            currentSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 bg-[#15803d] text-white text-sm font-medium pl-3 pr-2 py-1 rounded-md shadow-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => onRemoveSkill(skill)}
                  className="hover:bg-[#166534] rounded p-0.5 transition-colors"
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
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1 pb-2">
          <h3 className="font-semibold text-base text-slate-900">Suggested Skills</h3>
          <p className="text-slate-400 text-xs">Click on any skill to add it to your profile</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {suggestedSkills.length === 0 ? (
            <p className="text-slate-400 text-sm">You have added all suggested skills!</p>
          ) : (
            suggestedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onAddSkill(skill)}
                className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>{skill}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
