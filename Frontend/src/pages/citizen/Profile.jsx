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
        <div className="bg-[#f5f7fb] min-h-screen">

            {/* TOPBAR */}
            <Topbar />

            {/* BODY */}
            <div className="flex">

                {/* LEFT SIDEBAR */}
                <Sidebar />

                {/* RIGHT CONTENT */}
                <div className="flex-1 px-16 py-10">

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

                </div>

            </div>

        </div>
    );
}
export default Profile;