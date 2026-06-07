import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import { AlertTriangle, MapPin, Upload, ShieldAlert, Send } from "lucide-react";

const Report = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <div className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
                    <div className="mx-auto w-full max-w-[1400px] space-y-8">

                        {/* Page Header */}
                        <header className="rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-sm sm:p-10 mb-2">
                            <div className="max-w-3xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-3">
                                    Report an incident
                                </p>
                                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                                    Submit a disaster report quickly and securely.
                                </h1>
                                <p className="text-base leading-7 text-slate-600 sm:text-lg">
                                    Provide accurate incident details so emergency services can respond faster and keep your community safe.
                                </p>
                            </div>
                        </header>

                        {/* Form + Description Grid */}
                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">

                            {/* Left: Map inputs */}
                            <section className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-1">
                                            Disaster Type
                                        </label>
                                        <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10">
                                            <option>Select emergency type</option>
                                            <option>Flood</option>
                                            <option>Fire</option>
                                            <option>Storm</option>
                                            <option>Hazard</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-1">
                                            Location
                                        </label>
                                        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                                            <MapPin className="text-[#0B1F6D] shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Enter address or landmark"
                                                className="w-full bg-transparent text-slate-800 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                                    <iframe
                                        title="report-map"
                                        className="h-64 w-full rounded-[22px] border border-slate-200"
                                        src="https://maps.google.com/maps?q=Sri Lanka&t=&z=7&ie=UTF8&iwloc=&output=embed"
                                    />
                                </div>
                            </section>

                            {/* Right: Description + Upload */}
                            <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-3">
                                        Description
                                    </label>
                                    <textarea
                                        rows="8"
                                        placeholder="Describe the incident, hazards, and people affected..."
                                        className="min-h-[210px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-3">
                                        Optional Image Upload
                                    </label>
                                    <div className="rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-[#0B1F6D]/70">
                                        <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E8F7F0] text-[#0B6C57]">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900 mb-2">Click to upload or drag and drop</p>
                                        <p className="text-sm text-slate-500 mb-5">PNG, JPG, or HEIC • max 10MB</p>
                                        <input type="file" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Submit Button Section */}
                        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                            <button className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-[#10B981] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#0F9D70] hover:shadow-lg active:scale-[0.98]">
                                <Send size={22} />
                                Submit Report
                            </button>
                            <p className="mt-5 text-center text-sm uppercase tracking-[0.3em] text-slate-400">
                                Your data is encrypted and sent directly to emergency services.
                            </p>
                        </section>

                        {/* Info Cards */}
                        <div className="grid gap-5 lg:grid-cols-3">
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <ShieldAlert size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Need Immediate Help?</h3>
                                <p className="text-slate-600 leading-7">
                                    If you are in life-threatening danger, call 911 immediately.
                                </p>
                            </button>
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Safe Zones</h3>
                                <p className="text-slate-600 leading-7">
                                    View the nearest evacuation centers and medical outposts.
                                </p>
                            </button>
                            <button className="rounded-[28px] border border-slate-200 bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D] mb-5">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Live Alerts</h3>
                                <p className="text-slate-600 leading-7">
                                    Stay updated with real-time emergency broadcasts from HQ.
                                </p>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
