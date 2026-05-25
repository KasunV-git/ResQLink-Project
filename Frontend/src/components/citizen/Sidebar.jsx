import {
    LayoutDashboard,
    Bell,
    Map,
    Megaphone,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const linkStyle =
        "flex items-center gap-5 px-5 py-4 rounded-xl text-[17px] transition-all duration-200 mx-5";

    const activeStyle =
        "bg-blue-100 text-blue-900 font-semibold";

    return (
        <div className="w-72 bg-white border-r border-gray-200 min-h-screen py-8">

            {/* LOGO */}
            <div className="px-10 mb-14">

                <h1 className="text-4xl font-bold text-blue-900 mb-2">
                    ResQLink
                </h1>

                <p className="text-gray-500 text-sm tracking-[0.2em]">
                    CITIZEN PORTAL
                </p>

            </div>

            {/* NAVIGATION */}
            <div className="flex flex-col gap-4">

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? activeStyle
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    <LayoutDashboard size={22} />

                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/report"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? activeStyle
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    <Megaphone size={22} />

                    <span>Report</span>
                </NavLink>

                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? activeStyle
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    <Bell size={22} />

                    <span>Alerts</span>
                </NavLink>

                <NavLink
                    to="/map"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? activeStyle
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    <Map size={22} />

                    <span>Map</span>
                </NavLink>

            </div>
        </div>
    );
};

export default Sidebar;