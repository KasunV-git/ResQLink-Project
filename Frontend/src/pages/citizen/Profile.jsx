import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";
import { Mail, Phone, MapPin, ShieldCheck, LogOut, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
    const user = {
        name: "Marcus Aurelius",
        role: "Citizen",
        email: "m.aurelius@resqlink.org",
        phone: "+1 555-0123",
        region: "Metropolitan Sector 4",
        joined: "October 2023",
        profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-slate-900 overflow-x-hidden">
            <Topbar />

            <div className="flex min-h-screen pt-20">
                <Sidebar />

                <div className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
                    <div className="mx-auto w-full max-w-[1400px]">
                        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">

                            {/* Profile Hero Banner */}
                            <div className="bg-[#0B1F6D] p-8 sm:p-10">
                                <div className="relative mx-auto max-w-6xl">
                                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
                                        <div className="text-center sm:text-left">
                                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200 mb-4">
                                                Citizen profile
                                            </p>
                                            <h1 className="text-4xl font-extrabold text-white mb-3">
                                                {user.name}
                                            </h1>
                                            <p className="text-base leading-7 text-slate-200 sm:text-lg">
                                                Verified citizen with active disaster reporting privileges.
                                            </p>
                                        </div>
                                        <Link
                                            to="/edit-profile"
                                            className="inline-flex items-center justify-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20 hover:shadow-lg active:scale-[0.98]"
                                        >
                                            <Pencil size={18} />
                                            Edit Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="relative px-6 pb-12 sm:px-8 sm:pb-14">
                                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 pt-2">

                                    {/* Left Card: Avatar + Stats */}
                                    <div className="-mt-20 rounded-[32px] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]">
                                        <div className="flex flex-col items-center gap-5 text-center mb-8">
                                            <img
                                                src={user.profile}
                                                alt={user.name}
                                                className="h-40 w-40 rounded-[32px] object-cover shadow-xl"
                                            />
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.24em] text-slate-400 mb-1">{user.role}</p>
                                                <p className="text-lg font-semibold text-slate-900">Verified Responder</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Member Since</p>
                                                <p className="text-xl font-semibold text-slate-900">{user.joined}</p>
                                            </div>
                                            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Region</p>
                                                <p className="text-xl font-semibold text-slate-900">{user.region}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Info Sections */}
                                    <div className="space-y-6 mt-6 lg:mt-8">

                                        {/* Contact Details */}
                                        <section className="rounded-[32px] border border-slate-200 bg-slate-50 p-8">
                                            <div className="mb-6">
                                                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-2">Contact details</p>
                                                <p className="text-2xl font-semibold text-slate-900">Account credentials</p>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-[28px] bg-white p-5 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                                            <Mail size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Email Address</p>
                                                            <p className="text-xl font-semibold text-slate-900">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rounded-[28px] bg-white p-5 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                                            <Phone size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">Contact Number</p>
                                                            <p className="text-xl font-semibold text-slate-900">{user.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Security */}
                                        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#E8F4FF] text-[#0B1F6D]">
                                                    <ShieldCheck size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-1">Security</p>
                                                    <p className="text-2xl font-semibold text-slate-900">Secure session active</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 leading-7">
                                                Your profile and report activity are secured with encrypted transmissions and verified access controls.
                                            </p>
                                        </section>

                                        {/* Logout */}
                                        <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 text-center">
                                            <button className="inline-flex items-center justify-center gap-3 rounded-3xl border border-transparent bg-[#F8FAFC] px-8 py-4 text-base font-semibold text-slate-900 transition hover:bg-[#EDF2F7] hover:shadow-sm active:scale-[0.98]">
                                                <LogOut size={20} />
                                                Log Out of ResQLink
                                            </button>
                                            <p className="mt-5 text-sm text-slate-500">
                                                Version 4.2.1 • Secure session encrypted
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
