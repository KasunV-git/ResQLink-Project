import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import { MapPin, Compass, ShieldCheck, AlertTriangle } from "lucide-react";

const MapPage = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
                    <div className="mx-auto w-full max-w-[1400px] space-y-8">

                        {/* Page Header */}
                        <header className="rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-sm sm:p-10 mb-2">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-3xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-3">
                                        Situation map
                                    </p>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                                        Live safety map and hazard overlay.
                                    </h1>
                                    <p className="text-base leading-7 text-slate-600 sm:text-lg">
                                        Review current threats, evacuation routes, and nearby resources across your district.
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Active Hazards</p>
                                        <p className="text-3xl font-semibold text-slate-900">5</p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-3">Safe Corridors</p>
                                        <p className="text-3xl font-semibold text-slate-900">12</p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Map + Sidebar Panel */}
                        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="rounded-[28px] overflow-hidden border border-slate-200">
                                    <iframe
                                        title="safety-map"
                                        className="h-[320px] w-full rounded-[28px] sm:h-[420px] lg:h-[520px]"
                                        src="https://maps.google.com/maps?q=Sri Lanka&t=&z=7&ie=UTF8&iwloc=&output=embed"
                                    />
                                </div>
                            </section>

                            <aside className="space-y-5">
                                {/* Current Zone */}
                                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                            <Compass size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Current zone</p>
                                            <p className="text-xl font-semibold text-slate-900">Metropolitan Sector 4</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                                        <p className="font-semibold text-slate-800 mb-1">Status</p>
                                        <p>Moderate observation with localized flood watch.</p>
                                        <p>Emergency resources are standing by nearby.</p>
                                    </div>
                                </div>

                                {/* Field Assistance */}
                                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Quick tools</p>
                                            <p className="text-xl font-semibold text-slate-900">Field assistance</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <button className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-[#F7FBFF] px-5 py-4 text-left text-slate-700 transition hover:bg-[#EDF4FF] hover:shadow-sm active:scale-[0.98]">
                                            <span className="font-medium">Report a new hazard</span>
                                            <AlertTriangle className="text-[#0B1F6D] shrink-0 ml-3" />
                                        </button>
                                        <button className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-[#F7FBFF] px-5 py-4 text-left text-slate-700 transition hover:bg-[#EDF4FF] hover:shadow-sm active:scale-[0.98]">
                                            <span className="font-medium">View evacuation routes</span>
                                            <MapPin className="text-[#0B1F6D] shrink-0 ml-3" />
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default MapPage;
