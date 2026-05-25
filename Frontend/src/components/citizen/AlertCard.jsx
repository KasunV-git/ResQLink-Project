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
        iconColor = "text-orange-550";
    } else if (severityLower.includes("update") || titleLower.includes("clearance") || titleLower.includes("open")) {
        Icon = CheckCircle2;
        iconBg = "bg-teal-50";
        iconColor = "text-teal-600";
    }

    return (
        <div className={`bg-white rounded-2xl p-6 border-l-8 ${alert.color} shadow-sm border border-gray-100 flex gap-5 items-start`}>
            <div className={`p-4 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                <Icon size={24} />
            </div>

            <div className="flex-1 flex justify-between items-start gap-4">
                <div>
                    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        {alert.severity}
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-slate-800">{alert.title}</h3>
                    <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">{alert.message}</p>
                </div>

                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{alert.time}</span>
            </div>
        </div>
    );
};

export default AlertCard;