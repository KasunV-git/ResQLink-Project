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

    const quickLinks = [
        {
            title: "My Reports",
            desc: "Track the status of your active reports",
            to: "/report",
        },
        {
            title: "Safety Map",
            desc: "Review current hazard zones and safe corridors",
            to: "/map",
        },
        {
            title: "Resources",
            desc: "Access guides, emergency kits, and support contacts",
            to: "/alerts",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <main className="flex-1 px-6 py-10 max-w-[1600px] mx-auto">
                    <div className="space-y-8">

                        {/* Hero / Welcome Section */}
                        <section className="rounded-[24px] border border-slate-200 bg-white/95 shadow-sm p-8 xl:p-10 mb-2">
                            <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                                <div className="max-w-3xl">
                                    <span className="inline-flex items-center rounded-full bg-[#EAF0FF] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#0B1F6D]">
                                        Citizen Portal
                                    </span>
                                    <h1 className="mt-6 mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                                        Good Morning, Citizen Marcus.
                                    </h1>
                                    <p className="max-w-2xl text-base sm:text-lg leading-8 text-slate-600">
                                        The sentinel is active. Your local area is currently under moderate observation.
                                        Stay informed, stay safe.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-[#DCE4F5] bg-[#F7F9FF] px-6 py-5 shadow-sm w-full max-w-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="grid h-14 w-14 place-items-center rounded-3xl bg-[#0B1F6D] text-white shadow-md">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-2">
                                                Alert Status
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900">
                                                Moderate observation in your zone
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assistance + Identity Row */}
                        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
                            <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-8">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-3">
                                            Immediate Assistance
                                        </p>
                                        <h2 className="mb-4 text-3xl font-extrabold text-slate-900">
                                            Report hazards and emergencies instantly.
                                        </h2>
                                        <p className="max-w-2xl text-base leading-7 text-slate-600">
                                            Your report helps first responders move faster. Share verified details, location, and severity to keep your community safe.
                                        </p>
                                    </div>

                                    <AssistanceCard />
                                </div>
                            </section>

                            <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="grid h-14 w-14 place-items-center rounded-3xl bg-[#E8F7F0] text-[#0B6C57] shadow-sm">
                                        <ShieldCheck size={26} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-1">
                                            Verified Identity
                                        </p>
                                        <h3 className="text-2xl font-semibold text-slate-900">
                                            Marcus Aurelius
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-3xl bg-slate-50 p-5">
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-slate-500 mb-1">Trust Score</p>
                                                <p className="text-lg font-bold text-slate-900">92 / 100</p>
                                            </div>
                                            <span className="rounded-full bg-[#EAF0FF] px-4 py-1.5 text-sm font-semibold text-[#0B1F6D]">
                                                Elite Respondee
                                            </span>
                                        </div>

                                        <div className="rounded-full bg-slate-200 h-3 overflow-hidden">
                                            <div className="h-3 rounded-full bg-[#0B1F6D] w-[92%] transition-all duration-500"></div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Verification</p>
                                            <p className="text-base font-semibold text-slate-900">Government ID Verified</p>
                                        </div>
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Emergency readiness</p>
                                            <p className="text-base font-semibold text-slate-900">Alert subscriptions enabled</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Alerts + Quick Navigation Row */}
                        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
                            <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Recent Alerts</h2>
                                        <p className="text-sm text-slate-500 max-w-xl">
                                            Monitor the latest emergency updates and severity changes in your area.
                                        </p>
                                    </div>
                                    <button className="inline-flex items-center justify-center rounded-full border border-[#D8E2F0] bg-[#F7F9FF] px-6 py-2.5 text-sm font-semibold text-[#0B1F6D] transition hover:bg-[#E8EFFD] hover:shadow-sm">
                                        View All Alerts
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {alerts.map((alert, index) => (
                                        <AlertCard key={index} alert={alert} />
                                    ))}
                                </div>
                            </section>

                            <aside className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Navigation</h2>
                                    <p className="text-sm text-slate-500">
                                        Jump to the tools you use most during emergency response.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {quickLinks.map((link) => (
                                        <QuickCard
                                            key={link.title}
                                            title={link.title}
                                            desc={link.desc}
                                            to={link.to}
                                        />
                                    ))}
                                </div>
                            </aside>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
