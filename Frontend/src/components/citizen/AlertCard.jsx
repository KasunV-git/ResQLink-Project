import { Home, Wind, CheckCircle2, AlertTriangle } from "lucide-react";

const AlertCard = ({ alert }) => {
    let Icon = AlertTriangle;
    let iconBg = "bg-red-50";
    let iconColor = "text-red-600";

    const titleLower = alert.title.toLowerCase();
    const severityLower = alert.severity.toLowerCase();

    if (severityLower.includes("extreme") || titleLower.includes("river") || titleLower.includes("flood")) {
        Icon = Home;
        iconBg = "bg-red-50";
        iconColor = "text-red-600";
    } else if (titleLower.includes("wind") || severityLower.includes("moderate")) {
        Icon = Wind;
        iconBg = "bg-orange-50";
        iconColor = "text-orange-600";
    } else if (severityLower.includes("update") || titleLower.includes("clearance") || titleLower.includes("open")) {
        Icon = CheckCircle2;
        iconBg = "bg-teal-50";
        iconColor = "text-teal-600";
    }

    return (
        <div className="group flex min-w-0 gap-5 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={`${alert.color} min-w-[6px]`} />
            <div className="flex-1 min-w-0 p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${iconBg} ${iconColor}`}>
                        <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 break-words">
                        {alert.severity}
                    </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 break-words mb-3">{alert.title}</h3>
                <p className="text-sm leading-6 text-slate-600 break-words">{alert.message}</p>
            </div>
            <div className="flex items-start pr-6 pt-6">
                <span className="text-xs font-medium text-slate-400">{alert.time}</span>
            </div>
        </div>
    );
};

export default AlertCard;
