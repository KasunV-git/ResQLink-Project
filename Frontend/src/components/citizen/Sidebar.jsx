import {
    LayoutDashboard,
    Bell,
    Map,
    Megaphone,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const getClass = (isActive) =>
        `flex items-center gap-3.5 py-3 mx-3 px-5 rounded-lg text-[16px] transition-all duration-200 border ${
            isActive
                ? "bg-blue-100 text-blue-900 border-blue-200 font-semibold"
                : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900"
        }`;

    const navItems = [
        { to: "/",       label: "Dashboard", Icon: LayoutDashboard },
        { to: "/report", label: "Report",    Icon: Megaphone       },
        { to: "/alerts", label: "Alerts",    Icon: Bell            },
        { to: "/map",    label: "Map",       Icon: Map             },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 py-8 flex flex-col">

            {/* LOGO */}
            <div className="px-7 mb-10 text-center">
                <h1 className="text-3xl font-bold text-blue-900 mb-1">
                    ResQLink
                </h1>
                <p className="text-gray-400 text-xs tracking-[0.2em] font-semibold uppercase">
                    Citizen Portal
                </p>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-3">
                {navItems.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) => getClass(isActive)}
                    >
                        {/* Fixed-width icon slot — all icons align on same vertical axis */}
                        <span className="w-6 flex items-center justify-center shrink-0">
                            <Icon size={20} />
                        </span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;