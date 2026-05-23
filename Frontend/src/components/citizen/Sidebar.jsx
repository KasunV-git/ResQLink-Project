import {
    LayoutDashboard,
    Bell,
    Map,
    Flag,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const linkStyle =
        "flex items-center gap-5 px-6 py-4 rounded-lg transition-all duration-200 text-[17px] w-[90%]";

    const activeStyle =
        "bg-blue-100 text-blue-900 font-semibold";

    return (
        <div className="w-56 bg-white min-h-screen pt-10 pl-10 pr-6">

            {/* LOGO SECTION */}
            <div className="mb-16">

                <h1 className="text-xl font-bold text-blue-900 tracking-wide mb-3 ">
                    ResQLink
                </h1>

                <p className="text-gray-500 text-xs tracking-[0.1em] leading-normal">
                    CITIZEN PORTAL
                </p>

            </div>

            {/* NAVIGATION */}
            <div className="flex flex-col gap-3 pl-3">

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive
                            ? activeStyle
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    <LayoutDashboard size={24} />

                    <span className="leading-10">
                        Dashboard
                    </span>
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
                    <Flag size={24} />

                    <span className="leading-8">
                        Report
                    </span>
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
                    <Bell size={24} />

                    <span className="leading-8">
                        Alerts
                    </span>
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
                    <Map size={24} />

                    <span className="leading-8">
                        Map
                    </span>
                </NavLink>

            </div>
        </div>
    );
};

export default Sidebar;