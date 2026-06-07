import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import { Mail, ShieldCheck } from "lucide-react";

const EditProfile = () => {
    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <div className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
                    <div className="mx-auto w-full max-w-[1200px] space-y-8">

                        {/* Page Header */}
                        <header className="rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-sm sm:p-10 mb-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D] mb-3">
                                Citizen settings
                            </p>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                                Update profile information
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-slate-600">
                                Keep your contact and region details accurate so emergency alerts reach you without delay.
                            </p>
                        </header>

                        {/* Form Section */}
                        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="grid gap-6 lg:grid-cols-2">

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10"
                                        defaultValue="Marcus Aurelius"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10"
                                        defaultValue="m.aurelius@resqlink.org"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10"
                                        defaultValue="+1 555-0123"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2">
                                        Primary Region
                                    </label>
                                    <input
                                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-[#0B1F6D] focus:ring-2 focus:ring-[#0B1F6D]/10"
                                        defaultValue="Metropolitan Sector 4"
                                    />
                                </div>

                            </div>

                            <div className="mt-8 space-y-5">
                                {/* Verification Notice */}
                                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-2">Emergency verification</p>
                                            <p className="text-base leading-7 text-slate-700">Your identity and alert preferences are protected and verified.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-[#0B1F6D] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#0A1A5A] hover:shadow-lg active:scale-[0.98]">
                                    <Mail size={20} />
                                    Save Changes
                                </button>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
