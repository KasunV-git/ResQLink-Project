import { NavLink } from "react-router-dom";

const Topbar = () => {
    const navStyle =
        "pb-1 transition-all duration-200 hover:text-blue-900";

    const activeStyle =
        "border-b-2 border-blue-900 font-bold text-blue-900";

    return (
        <div className="w-full bg-white h-20 border-b shadow-sm flex items-center justify-center relative">

            {/* CENTER NAVIGATION */}
            <div className="flex gap-12 text-lg text-gray-600">

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

            {/* PROFILE ICON */}
            <div className="absolute right-8 w-12 h-12 rounded-full bg-blue-900 cursor-pointer hover:scale-105 transition-all duration-300"></div>
        </div>
    );
};

export default Topbar;