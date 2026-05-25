import { History, Map, BookOpen, ChevronRight } from "lucide-react";

const QuickCard = ({ title, desc }) => {
    let Icon = BookOpen;
    let iconBg = "bg-amber-50";
    let iconColor = "text-amber-600";

    const titleLower = title.toLowerCase();

    if (titleLower.includes("report")) {
        Icon = History;
        iconBg = "bg-indigo-50";
        iconColor = "text-indigo-600";
    } else if (titleLower.includes("map") || titleLower.includes("safety")) {
        Icon = Map;
        iconBg = "bg-sky-50";
        iconColor = "text-sky-600";
    }

    return (
        <div className="bg-white rounded-2xl p-5 flex justify-between items-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
                    <Icon size={22} />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                        {title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        {desc}
                    </p>
                </div>
            </div>

            <ChevronRight className="text-slate-350 w-5 h-5 shrink-0" />
        </div>
    );
};

export default QuickCard;