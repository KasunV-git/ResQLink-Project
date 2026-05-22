import { NavLink } from "react-router-dom";

const Topbar = () => {
    const navStyle =
        "pb-1 transition-all duration-200 hover:text-blue-900";

    const activeStyle =
        "border-b-2 border-blue-900 font-bold text-blue-900";

    return (
        <div className="bg-white h-20 border-b flex items-center justify-between px-10 shadow-sm">
            <div className="flex gap-10 text-gray-600 text-lg">
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

            <div className="w-12 h-12 rounded-full bg-blue-900 cursor-pointer hover:scale-105 transition-all"></div>
        </div>
    );
};

export default Topbar;