import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Bell, Settings, UserCircle2, Menu, X } from "lucide-react";

const Topbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navStyle =
        "pb-1 transition-all duration-200 text-slate-500 hover:text-[#0B1F6D] font-medium";
    const activeStyle =
        "border-b-2 border-[#0B1F6D] font-semibold text-[#0B1F6D]";

    const navItems = [
        { to: "/", label: "Dashboard", end: true },
        { to: "/report", label: "Report" },
        { to: "/alerts", label: "Alerts" },
        { to: "/map", label: "Map" },
    ];

    return (
        <div className="fixed inset-x-0 top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
            <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#0B1F6D] text-white shadow-md text-lg font-black">
                        R
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0B1F6D]">
                            ResQLink
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Citizen Portal</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10 text-sm">
                    {navItems.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `${navStyle} ${isActive ? activeStyle : ""}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
                        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-700 hover:bg-slate-100 hover:text-[#0B1F6D] transition-all duration-200"
                    >
                        <Bell size={20} />
                    </button>

                    <button
                        type="button"
                        aria-label="Settings"
                        className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-700 hover:bg-slate-100 hover:text-[#0B1F6D] transition-all duration-200"
                    >
                        <Settings size={20} />
                    </button>

                    <Link
                        to="/profile"
                        className="grid h-12 w-12 place-items-center rounded-3xl bg-[#EFF3FF] text-[#0B1F6D] shadow-sm transition hover:scale-105 hover:shadow-md"
                    >
                        <UserCircle2 size={26} />
                    </Link>
                </div>

                {/* Mobile Dropdown Nav */}
                {menuOpen && (
                    <div className="absolute inset-x-0 top-full z-20 border-t border-slate-200 bg-white px-5 py-4 shadow-md md:hidden">
                        <nav className="flex flex-col gap-2 text-sm">
                            {navItems.map(({ to, label, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block rounded-3xl px-5 py-3 ${navStyle} ${isActive ? activeStyle : ""}`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;
