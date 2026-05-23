import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import AlertCard from "../../components/citizen/AlertCard";
import QuickCard from "../../components/citizen/QuickCard";
import AssistanceCard from "../../components/citizen/AssistanceCard";

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
        <div className="bg-gray-100 min-h-screen">

            <Topbar />

            <div className="flex">
                <Sidebar />

                <div className="flex-1"></div>



                <div className="p-8">
                    <h1 className="text-5xl font-bold mb-3">
                        Good morning, Citizen Marcus.
                    </h1>

                    <p className="text-gray-600 text-lg mb-10">
                        The sentinel is active. Your local area is currently under moderate
                        observation. Stay informed, stay safe.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="col-span-2">
                            <AssistanceCard />
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-xl mb-2">Verified Identity</h2>
                            <p className="text-gray-600">Marcus Aurelius</p>

                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                <div className="bg-blue-700 h-2 rounded-full w-3/4"></div>
                            </div>

                            <p className="text-sm mt-2">
                                Trust Score: 780 (Elite Respondee)
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-3xl font-bold">Recent Alerts</h2>
                                <button className="text-blue-800 font-semibold">
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
                            <h2 className="text-3xl font-bold mb-6">Quick Navigation</h2>

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