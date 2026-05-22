import { LayoutDashboard, Bell, Map, Flag } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-white min-h-screen p-6 border-r">
            <h1 className="text-3xl font-bold text-blue-900 mb-1">ResQLink</h1>

            <p className="text-gray-500 mb-10 tracking-widest">
                CITIZEN PORTAL
            </p>

            <div className="space-y-4">
                <button className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl w-full">
                    <LayoutDashboard size={20} />
                    Dashboard
                </button>

                <button className="flex items-center gap-3 p-4 rounded-xl w-full">
                    <Flag size={20} />
                    Report
                </button>

                <button className="flex items-center gap-3 p-4 rounded-xl w-full">
                    <Bell size={20} />
                    Alerts
                </button>

                <button className="flex items-center gap-3 p-4 rounded-xl w-full">
                    <Map size={20} />
                    Map
                </button>
            </div>
        </div>
    );
};

export default Sidebar;