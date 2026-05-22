import {
    LayoutDashboard,
    Bell,
    Map,
    Flag,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const linkStyle =
        "flex items-center gap-3 p-4 rounded-xl w-full transition-all duration-200";

    const activeStyle =
        "bg-blue-100 text-blue-900 font-semibold";

    return (
        <div className="w-64 bg-white min-h-screen p-6 border-r shadow-sm">
            <h1 className="text-4xl font-bold text-blue-900 mb-1">
                ResQLink
            </h1>

            <p className="text-gray-500 mb-10 tracking-widest">
                CITIZEN PORTAL
            </p>

            <div className="space-y-3">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-100"}`
                    }
                >
                    <LayoutDashboard size={22} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/report"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-100"}`
                    }
                >
                    <Flag size={22} />
                    Report
                </NavLink>

                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-100"}`
                    }
                >
                    <Bell size={22} />
                    Alerts
                </NavLink>

                <NavLink
                    to="/map"
                    className={({ isActive }) =>
                        `${linkStyle} ${isActive ? activeStyle : "hover:bg-gray-100"}`
                    }
                >
                    <Map size={22} />
                    Map
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;