import { Asterisk } from "lucide-react";

const AssistanceCard = () => {
    return (
        <div className="bg-white rounded-2xl p-8 flex justify-between items-center shadow-sm border border-gray-100">
            <div>
                <h2 className="text-3xl font-bold mb-2 text-slate-800">
                    Immediate Assistance
                </h2>

                <p className="text-gray-500 text-lg">
                    Spotted a hazard or emergency? Inform the network instantly.
                </p>
            </div>

            <button className="bg-teal-700 hover:bg-teal-800 text-white border-2 border-teal-950 px-12 py-5 rounded-none font-bold flex items-center justify-center gap-4 transition-all duration-200 shadow-md w-80 cursor-pointer">
                <Asterisk size={32} className="text-teal-200" />
                <div className="flex flex-col text-left leading-tight">
                    <span className="text-sm font-medium opacity-90">Report</span>
                    <span className="text-xl font-bold tracking-wide">Disaster</span>
                </div>
            </button>
        </div>
    );
};

export default AssistanceCard;