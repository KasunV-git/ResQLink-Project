import {
    LayoutDashboard,
    Bell,
    Map,
    Megaphone,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const getClass = (isActive) =>
        `flex items-center gap-4 rounded-3xl px-5 py-3.5 text-[15px] transition-all duration-200 border ${
            isActive
                ? "bg-[#EFF3FF] text-[#0B1F6D] border-[#D8E2F5] font-semibold shadow-sm"
                : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
        }`;

    const navItems = [
        { to: "/", label: "Dashboard", Icon: LayoutDashboard },
        { to: "/report", label: "Report", Icon: Megaphone },
        { to: "/alerts", label: "Alerts", Icon: Bell },
        { to: "/map", label: "Map", Icon: Map },
    ];

    return (
        <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-white border-r border-slate-200 px-6 py-8 shadow-sm sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">

            {/* Brand */}
            <div className="mb-10 flex flex-col gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0B1F6D] text-white text-xl font-black shadow-sm">
                    R
                </div>
                <div className="mt-3">
                    <h1 className="text-2xl font-bold text-[#0B1F6D] mb-1">ResQLink</h1>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold">
                        Citizen Portal
                    </p>
                </div>
            </div>

            {/* Nav Label */}
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Navigation
            </p>

            {/* Nav Items */}
            <nav className="flex flex-col gap-2">
                {navItems.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) => getClass(isActive)}
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                            <Icon size={20} />
                        </span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

        </aside>
    );
};

export default Sidebar;
