import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";

import {
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    LogOut,
    Pencil,
    Plus,
    CircleHelp,
} from "lucide-react";

import { Link } from "react-router-dom";

const Profile = () => {

    // DATABASE DATA LATER
    const user = {
        name: "Marcus Aurelius",
        role: "Citizen",
        email: "m.aurelius@resqlink.org",
        phone: "+1 555-0123",
        region: "Metropolitan Sector 4",
        joined: "October 2023",
        profile:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    };

    return (
        <div className="flex bg-[#f5f7fb] min-h-screen">

            {/* SIDEBAR */}
            <div className="w-72 bg-white min-h-screen flex flex-col justify-between py-8">

                {/* TOP */}
                <div>

                    {/* LOGO */}
                    <div className="px-10 mb-16">

                        <h1 className="text-4xl font-bold text-blue-950 mb-2">
                            ResQLink
                        </h1>

                        <p className="text-gray-400 tracking-[0.25em] text-sm">
                            COMMAND CENTER
                        </p>

                    </div>

                    {/* MENU */}
                    <div className="flex flex-col gap-3">

                        <Link
                            to="/"
                            className="mx-5 px-5 py-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/report"
                            className="mx-5 px-5 py-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                        >
                            Reports
                        </Link>

                        <Link
                            to="/alerts"
                            className="mx-5 px-5 py-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                        >
                            Alerts
                        </Link>

                        <Link
                            to="/map"
                            className="mx-5 px-5 py-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                        >
                            Maps
                        </Link>

                        {/* ACTIVE PROFILE */}
                        <Link
                            to="/profile"
                            className="mx-5 px-5 py-4 rounded-xl bg-blue-100 text-blue-900 font-semibold"
                        >
                            Profile
                        </Link>

                    </div>

                </div>

                {/* BOTTOM */}
                <div className="px-5">

                    {/* NEW REPORT */}
                    <button className="w-full bg-blue-900 hover:bg-blue-950 transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg mb-8">

                        + New Report

                    </button>

                    {/* SUPPORT */}
                    <button className="flex items-center gap-4 text-gray-600 hover:text-blue-900 transition-all duration-300 mb-6">

                        <CircleHelp size={22} />

                        Support

                    </button>

                    {/* SIGN OUT */}
                    <button className="flex items-center gap-4 text-gray-600 hover:text-red-600 transition-all duration-300">

                        <LogOut size={22} />

                        Sign Out

                    </button>

                </div>

            </div>

            {/* MAIN */}
            <div className="flex-1">

                {/* TOPBAR */}
                <Topbar />

                {/* CONTENT */}
                <div className="px-16 py-10">

                    {/* PROFILE CARD */}
                    <div className="bg-white rounded-[40px] overflow-hidden shadow-sm max-w-5xl mx-auto">

                        {/* HEADER */}
                        <div className="h-72 bg-blue-950 relative">

                            {/* PROFILE IMAGE */}
                            <div className="absolute left-14 bottom-[-60px]">

                                <img
                                    src={user.profile}
                                    alt=""
                                    className="w-36 h-36 rounded-3xl object-cover border-8 border-white shadow-lg"
                                />

                            </div>

                        </div>

                        {/* CONTENT */}
                        <div className="pt-24 px-14 pb-14">

                            {/* TOP SECTION */}
                            <div className="flex justify-between items-center mb-14">

                                <div>

                                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                                        {user.name}
                                    </h1>

                                    <div className="flex items-center gap-4">

                                        <span className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                                            Citizen
                                        </span>

                                        <span className="text-gray-500 text-xl">
                                            • Verified Responder
                                        </span>

                                    </div>

                                </div>

                                {/* EDIT BUTTON */}
                                <Link
                                    to="/edit-profile"
                                    className="bg-teal-600 hover:bg-teal-700 transition-all duration-300 text-white px-10 py-5 rounded-2xl text-xl font-semibold flex items-center gap-4"
                                >

                                    <Pencil size={22} />

                                    Edit Profile

                                </Link>

                            </div>

                            {/* INFO GRID */}
                            <div className="grid grid-cols-2 gap-8 mb-16">

                                {/* EMAIL */}
                                <div className="bg-gray-100 rounded-3xl p-8 flex items-center gap-6">

                                    <div className="bg-white p-4 rounded-2xl">
                                        <Mail className="text-blue-900" size={28} />
                                    </div>

                                    <div>

                                        <p className="uppercase text-gray-400 tracking-[0.25em] text-sm mb-2">
                                            Email Address
                                        </p>

                                        <p className="text-2xl font-semibold">
                                            {user.email}
                                        </p>

                                    </div>

                                </div>

                                {/* PHONE */}
                                <div className="bg-gray-100 rounded-3xl p-8 flex items-center gap-6">

                                    <div className="bg-white p-4 rounded-2xl">
                                        <Phone className="text-blue-900" size={28} />
                                    </div>

                                    <div>

                                        <p className="uppercase text-gray-400 tracking-[0.25em] text-sm mb-2">
                                            Contact Number
                                        </p>

                                        <p className="text-2xl font-semibold">
                                            {user.phone}
                                        </p>

                                    </div>

                                </div>

                                {/* REGION */}
                                <div className="bg-gray-100 rounded-3xl p-8 flex items-center gap-6">

                                    <div className="bg-white p-4 rounded-2xl">
                                        <MapPin className="text-blue-900" size={28} />
                                    </div>

                                    <div>

                                        <p className="uppercase text-gray-400 tracking-[0.25em] text-sm mb-2">
                                            Primary Region
                                        </p>

                                        <p className="text-2xl font-semibold">
                                            {user.region}
                                        </p>

                                    </div>

                                </div>

                                {/* MEMBER */}
                                <div className="bg-gray-100 rounded-3xl p-8 flex items-center gap-6">

                                    <div className="bg-white p-4 rounded-2xl">
                                        <ShieldCheck className="text-blue-900" size={28} />
                                    </div>

                                    <div>

                                        <p className="uppercase text-gray-400 tracking-[0.25em] text-sm mb-2">
                                            Member Since
                                        </p>

                                        <p className="text-2xl font-semibold">
                                            {user.joined}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* LOGOUT */}
                            <div className="border-t pt-12 text-center">

                                <button className="flex items-center gap-4 mx-auto text-3xl font-semibold hover:text-red-600 transition-all duration-300">

                                    <LogOut size={34} />

                                    Log Out of ResQLink

                                </button>

                                <p className="text-gray-400 mt-6 text-lg">
                                    Version 4.2.1 • Secure Session Encrypted
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mt-10">

                        <div className="bg-white rounded-3xl p-10 text-center">

                            <h2 className="text-5xl font-bold text-blue-950 mb-3">
                                12
                            </h2>

                            <p className="uppercase tracking-[0.25em] text-gray-400">
                                Reports Filed
                            </p>

                        </div>

                        <div className="bg-white rounded-3xl p-10 text-center">

                            <h2 className="text-5xl font-bold text-blue-950 mb-3">
                                03
                            </h2>

                            <p className="uppercase tracking-[0.25em] text-gray-400">
                                Active Alerts
                            </p>

                        </div>

                        <div className="bg-white rounded-3xl p-10 text-center">

                            <h2 className="text-5xl font-bold text-blue-950 mb-3">
                                84
                            </h2>

                            <p className="uppercase tracking-[0.25em] text-gray-400">
                                Trust Score
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Profile;