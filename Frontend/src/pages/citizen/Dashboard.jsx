import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import AlertCard from "../../components/citizen/AlertCard";
import QuickCard from "../../components/citizen/QuickCard";
import AssistanceCard from "../../components/citizen/AssistanceCard";
import { ShieldCheck } from "lucide-react";

const Dashboard = () => {
    const alerts = [
        {
            title: "River Level Alert: Zone B4",
            severity: "EXTREME SEVERITY",
            message:
                "Immediate evacuation required for coastal residents in Zone B4.",
            time: "2 mins ago",
            color: "border-red-600",
        },
        {
            title: "High Wind Warning",
            severity: "MODERATE ALERT",
            message:
                "Gusts up to 60mph expected between 2:00 PM and 6:00 PM today.",
            time: "45 mins ago",
            color: "border-orange-400",
        },
        {
            title: "Road Clearance: Main St",
            severity: "UPDATE",
            message:
                "Maintenance completed. Main Street is now open for emergency vehicles.",
            time: "3 hours ago",
            color: "border-teal-500",
        },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Topbar />

                <div className="p-10 flex-1 max-w-7xl w-full mx-auto">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Good morning, Citizen Marcus.
                    </h1>

                    <p className="text-slate-500 text-[17px] mb-8">
                        The sentinel is active. Your local area is currently under moderate
                        observation. Stay informed, stay safe.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="col-span-2">
                            <AssistanceCard />
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 text-blue-900 p-3 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck size={26} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-800">Verified Identity</h2>
                                    <p className="text-gray-500 text-sm">Marcus Aurelius</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-250 my-4"></div>

                            <div className="text-sm flex flex-col gap-2">
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className="bg-blue-900 h-1.5 rounded-full w-3/4"></div>
                                </div>
                                <div className="flex justify-between mt-1 text-slate-650 font-medium text-xs">
                                    <span>Trust Score: 780</span>
                                    <span className="text-blue-900 font-bold">(Elite Respondee)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recent Alerts</h2>
                                <button className="text-blue-900 hover:text-blue-800 font-semibold text-sm transition-colors duration-150">
                                    View All →
                                </button>
                            </div>

                            <div className="space-y-5">
                                {alerts.map((alert, index) => (
                                    <AlertCard key={index} alert={alert} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Quick Navigation</h2>

                            <div className="space-y-5">
                                <QuickCard
                                    title="My Reports"
                                    desc="Track status of your reports"
                                />

                                <QuickCard
                                    title="Safety Map"
                                    desc="Explore safe zones and hazards"
                                />

                                <QuickCard
                                    title="Resources"
                                    desc="Guides, supply kits, and kits"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;