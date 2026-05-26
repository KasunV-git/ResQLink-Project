import { NavLink, Link } from "react-router-dom";
import { Bell, Settings, UserCircle2 } from "lucide-react";


const Topbar = () => {
    const navStyle =
        "pb-1 transition-all duration-200 text-gray-500 hover:text-blue-900 font-medium";

    const activeStyle =
        "border-b-2 border-blue-900 font-semibold text-blue-900";

    return (
        <div className="w-full bg-white border-b border-gray-200 h-20 flex items-center justify-between px-10">

            {/* LEFT LOGO */}
            <div>

                <h1 className="text-4xl font-bold text-blue-900">
                    ResQLink
                </h1>

            </div>


            {/* CENTER NAVIGATION */}
            <div className="flex gap-12 text-sm text-gray-600">

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${navStyle} ${isActive ? activeStyle : ""}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/report"
                    className={({ isActive }) =>
                        `${navStyle} ${isActive ? activeStyle : ""}`
                    }
                >
                    Report
                </NavLink>

                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                        `${navStyle} ${isActive ? activeStyle : ""}`
                    }
                >
                    Alerts
                </NavLink>

                <NavLink
                    to="/map"
                    className={({ isActive }) =>
                        `${navStyle} ${isActive ? activeStyle : ""}`
                    }
                >
                    Map
                </NavLink>

            </div>


            {/* RIGHT ICONS */}
            <div className="flex items-center gap-6">

                <Bell
                    className="cursor-pointer text-gray-700 hover:text-blue-900 transition-all duration-200"
                />

                <Settings
                    className="cursor-pointer text-gray-700 hover:text-blue-900 transition-all duration-200"
                />

                <Link to="/profile">

                    <UserCircle2
                        size={38}
                        className="text-blue-900 cursor-pointer hover:scale-110 transition-all duration-300"
                    />

                </Link>

            </div>

        </div>
    );
};

export default Topbar;