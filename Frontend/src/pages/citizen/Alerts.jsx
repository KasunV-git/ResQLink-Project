import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import { Bell, Clock3, AlertTriangle, MapPinned, ShieldAlert } from "lucide-react";

const Alerts = () => {
    const alerts = [
        {
            title: "Flash Flood Warning",
            level: "CRITICAL",
            time: "2 mins ago",
            message: "Heavy rainfall has caused water levels to rise rapidly near coastal areas.",
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
            message: "Strong winds expected between 2PM and 8PM in western districts.",
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
            message: "Main highway access has been restored for emergency transportation.",
            instructions: ["Use approved travel routes only."],
            color: "border-sky-500",
            badge: "bg-sky-100 text-sky-700",
            button: "Archive Alert",
            buttonColor: "bg-sky-600 hover:bg-sky-700",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <div className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
                    <div className="mx-auto w-full max-w-[1400px] space-y-8">

                        {/* Page Header */}
                        <header className="rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-sm sm:p-10 mb-2">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                            Citizen Alerts
                                        </h1>
                                        <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700">
                                            2 Critical
                                        </span>
                                        <span className="rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
                                            4 Active
                                        </span>
                                    </div>
                                    <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                        Stay updated with emergency broadcasts, weather warnings, evacuation notices, and community safety updates.
                                    </p>
                                </div>
                                <button className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:shadow-sm active:scale-[0.98]">
                                    Filter Alerts
                                </button>
                            </div>
                        </header>

                        {/* Alert Cards */}
                        <section className="space-y-6">
                            {alerts.map((alert, index) => (
                                <div key={index} className={`rounded-[28px] border-2 ${alert.color} bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                                    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr] xl:items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                                <span className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.24em] ${alert.badge}`}>
                                                    {alert.level}
                                                </span>
                                                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                                                    <Clock3 size={16} />
                                                    {alert.time}
                                                </div>
                                            </div>

                                            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                                                {alert.title}
                                            </h2>
                                            <p className="text-base leading-7 text-slate-600 mb-7">
                                                {alert.message}
                                            </p>

                                            <div>
                                                <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Safety Instructions</p>
                                                <div className="space-y-3">
                                                    {alert.instructions.map((item, i) => (
                                                        <div key={i} className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 font-semibold shadow-sm">
                                                                {i + 1}
                                                            </div>
                                                            <p className="text-slate-700 leading-7">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-[#0B1F6D] shadow-sm">
                                                    <Bell size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Source</p>
                                                    <p className="text-xl font-semibold text-slate-900">ResQLink HQ</p>
                                                </div>
                                            </div>
                                            <button className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3.5 text-sm font-semibold text-white transition hover:shadow-md active:scale-[0.98] ${alert.buttonColor}`}>
                                                {alert.button}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Info Cards */}
                        <div className="grid gap-5 lg:grid-cols-3">
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <MapPinned size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Safe Zones</h3>
                                <p className="text-slate-600 leading-7">
                                    Locate evacuation centers and nearby shelters instantly.
                                </p>
                            </button>
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <ShieldAlert size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Emergency Status</h3>
                                <p className="text-slate-600 leading-7">
                                    Track live emergency conditions and rescue coordination.
                                </p>
                            </button>
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Community Support</h3>
                                <p className="text-slate-600 leading-7">
                                    Access humanitarian resources and volunteer coordination tools.
                                </p>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alerts;
