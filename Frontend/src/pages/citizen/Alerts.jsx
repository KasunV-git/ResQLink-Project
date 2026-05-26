import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";

import {
    Bell,
    Clock3,
    TriangleAlert,
    MapPinned,
    ShieldAlert,
    CheckCircle2,
} from "lucide-react";

const Alerts = () => {

    const alerts = [
        {
            title: "Flash Flood Warning",
            level: "CRITICAL",
            time: "2 mins ago",
            message:
                "Heavy rainfall has caused water levels to rise rapidly near coastal areas.",
            instructions: [
                "Move immediately to higher ground.",
                "Avoid bridges and flooded roads.",
                "Follow evacuation notices from authorities.",
            ],
            color: "border-red-500",
            badge: "bg-red-100 text-red-700",
            button: "Acknowledge Alert",
            buttonColor: "bg-red-600 hover:bg-red-700",
        },

        {
            title: "High Wind Advisory",
            level: "MODERATE",
            time: "18 mins ago",
            message:
                "Strong winds expected between 2PM and 8PM in western districts.",
            instructions: [
                "Secure outdoor belongings.",
                "Avoid unnecessary travel.",
            ],
            color: "border-yellow-400",
            badge: "bg-yellow-100 text-yellow-700",
            button: "Mark Safe",
            buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        },

        {
            title: "Road Clearance Update",
            level: "INFORMATION",
            time: "1 hour ago",
            message:
                "Main highway access has been restored for emergency transportation.",
            instructions: [
                "Use approved travel routes only.",
            ],
            color: "border-blue-500",
            badge: "bg-blue-100 text-blue-700",
            button: "Archive Alert",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Topbar />

            <div className="flex flex-1">
                <Sidebar />

                {/* CONTENT */}
                <div className="px-16 py-12 flex-1">


                    {/* PAGE HEADER */}
                    <div className="flex justify-between items-center mb-12">

                        <div>

                            <div className="flex items-center gap-4 mb-4">

                                <h1 className="text-5xl font-bold text-blue-950">
                                    Citizen Alerts
                                </h1>

                                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    2 Critical
                                </div>

                                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    4 Active
                                </div>

                            </div>

                            <p className="text-gray-600 text-lg leading-9 max-w-3xl">
                                Stay updated with emergency broadcasts, weather warnings,
                                evacuation notices, and important community safety updates.
                            </p>

                        </div>

                        {/* FILTER BUTTON */}
                        <button className="bg-white hover:bg-gray-100 transition-all duration-300 px-8 py-4 rounded-2xl shadow-sm font-semibold text-blue-950">

                            Filter Alerts

                        </button>

                    </div>

                    {/* ALERT CARDS */}
                    <div className="space-y-8">

                        {alerts.map((alert, index) => (

                            <div
                                key={index}
                                className={`bg-white rounded-3xl shadow-sm border-l-4 ${alert.color} p-10 flex justify-between gap-10`}
                            >

                                {/* LEFT */}
                                <div className="flex-1">

                                    {/* TOP */}
                                    <div className="flex items-center gap-4 mb-5">

                                        <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider ${alert.badge}`}>
                                            {alert.level}
                                        </div>

                                        <div className="flex items-center text-gray-400 text-sm">

                                            <Clock3 size={16} className="mr-2" />

                                            {alert.time}

                                        </div>

                                    </div>

                                    {/* TITLE */}
                                    <h2 className="text-4xl font-bold text-gray-900 mb-5">
                                        {alert.title}
                                    </h2>

                                    {/* MESSAGE */}
                                    <p className="text-gray-600 text-lg leading-9 mb-8">
                                        {alert.message}
                                    </p>

                                    {/* INSTRUCTIONS */}
                                    <div>

                                        <p className="uppercase text-sm tracking-[0.3em] text-gray-400 mb-5">
                                            Safety Instructions
                                        </p>

                                        <div className="space-y-4">

                                            {alert.instructions.map((item, i) => (

                                                <div
                                                    key={i}
                                                    className="flex items-start gap-4"
                                                >

                                                    <div className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                                                        {i + 1}
                                                    </div>

                                                    <p className="text-gray-700 text-lg">
                                                        {item}
                                                    </p>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                                {/* RIGHT */}
                                <div className="w-72 flex flex-col justify-between border-l pl-10">

                                    <div>

                                        <p className="uppercase text-sm tracking-[0.3em] text-gray-400 mb-4">
                                            Source
                                        </p>

                                        <div className="flex items-center gap-4">

                                            <div className="bg-blue-100 p-3 rounded-xl">
                                                <Bell className="text-blue-900" />
                                            </div>

                                            <p className="font-semibold text-xl">
                                                ResQLink HQ
                                            </p>

                                        </div>

                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        className={`${alert.buttonColor} transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg mt-10`}
                                    >

                                        {alert.button}

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* BOTTOM CARDS */}
                    <div className="grid grid-cols-3 gap-8 mt-14">

                        {/* SAFE ZONES */}
                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <MapPinned className="text-blue-900 mb-5" size={32} />

                            <h3 className="font-bold text-2xl mb-3">
                                Safe Zones
                            </h3>

                            <p className="text-gray-600 leading-8">
                                Locate evacuation centers and nearby shelters instantly.
                            </p>

                        </button>

                        {/* LIVE STATUS */}
                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <ShieldAlert className="text-blue-900 mb-5" size={32} />

                            <h3 className="font-bold text-2xl mb-3">
                                Emergency Status
                            </h3>

                            <p className="text-gray-600 leading-8">
                                Track live emergency conditions and rescue coordination.
                            </p>

                        </button>

                        {/* COMMUNITY */}
                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <CheckCircle2 className="text-blue-900 mb-5" size={32} />

                            <h3 className="font-bold text-2xl mb-3">
                                Community Updates
                            </h3>

                            <p className="text-gray-600 leading-8">
                                Stay informed about verified reports and public announcements.
                            </p>

                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Alerts;