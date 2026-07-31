// Formatting and utility helper functions for ResQLink Admin Panel

export const formatPercent = (val) => {
  if (typeof val === "number") {
    return `${val}%`;
  }
  return val;
};

export const getStatusColor = (status) => {
  const normalized = status?.toLowerCase();
  switch (normalized) {
    case "critical":
    case "high":
    case "active":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    case "medium":
    case "investigating":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case "low":
    case "functional":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
  }
};

export const getScoreColor = (score) => {
  if (score >= 90) return "text-emerald-500";
  if (score >= 75) return "text-amber-500";
  return "text-red-500";
};
