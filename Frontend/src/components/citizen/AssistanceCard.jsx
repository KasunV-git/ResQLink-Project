import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const AssistanceCard = () => {
    return (
        <div className="rounded-[22px] bg-[#0B1F6D] p-7 sm:p-8 shadow-lg ring-1 ring-[#0B1F6D]/10 w-full max-w-sm shrink-0">
            <div className="flex flex-col gap-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200 mb-4">
                        Emergency response
                    </p>
                    <h3 className="text-3xl font-extrabold text-white leading-tight mb-4">
                        Report Disaster
                    </h3>
                    <p className="text-base leading-7 text-teal-100">
                        If you see a hazard, flood, fire or blocked evacuation route, alert the response team immediately so your community can stay safe.
                    </p>
                </div>

                <Link
                    to="/report"
                    className="inline-flex items-center justify-center gap-3 rounded-3xl bg-[#10B981] px-7 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-[#0F9D70] hover:shadow-2xl active:scale-[0.98]"
                >
                    <AlertTriangle size={20} />
                    Report Disaster
                </Link>
            </div>
        </div>
    );
};

export default AssistanceCard;
