const Topbar = () => {
    return (
        <div className="bg-white h-20 border-b flex items-center justify-between px-10">
            <div className="flex gap-10 text-gray-600">
                <button className="font-bold border-b-2 border-blue-900">
                    Dashboard
                </button>

                <button>Report</button>
                <button>Alerts</button>
                <button>Map</button>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-900"></div>
        </div>
    );
};

export default Topbar;