import { Link } from "react-router-dom";
import { History, Map, BookOpen, ChevronRight } from "lucide-react";

const QuickCard = ({ title, desc, to }) => {
    let Icon = BookOpen;
    let iconBg = "bg-amber-50";
    let iconColor = "text-amber-600";

    const titleLower = title.toLowerCase();

    if (titleLower.includes("report")) {
        Icon = History;
        iconBg = "bg-[#E8F2FF]";
        iconColor = "text-[#2563EB]";
    } else if (titleLower.includes("map") || titleLower.includes("safety")) {
        Icon = Map;
        iconBg = "bg-[#E0F2FE]";
        iconColor = "text-[#0EA5E9]";
    }

    const content = (
        <div className="min-w-0 rounded-[22px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl ${iconBg} ${iconColor}`}>
                    <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 break-words mb-1">{title}</h3>
                    <p className="text-sm leading-6 text-slate-500 break-words">{desc}</p>
                </div>
                <ChevronRight className="mt-1 text-slate-400 shrink-0" />
            </div>
        </div>
    );

    return to ? (
        <Link to={to} className="block">
            {content}
        </Link>
    ) : (
        content
    );
};

export default QuickCard;
