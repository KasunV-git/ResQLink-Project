import Sidebar from "../../components/citizen/Sidebar";
import Topbar from "../../components/citizen/Topbar";

import {
    MapPin,
    Upload,
    TriangleAlert,
    ShieldAlert,
    Send,
} from "lucide-react";

const Report = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Topbar />

            <div className="flex flex-1">
                <Sidebar />

                {/* CONTENT */}
                <div className="px-16 py-12 flex-1">

                    {/* TITLE */}
                    <div className="text-center mb-14">

                        <h1 className="text-6xl font-bold text-blue-950 mb-6">
                            Submit Report
                        </h1>

                        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-10">
                            Provide critical incident details to help first responders
                            prioritize and coordinate emergency efforts in your area.
                        </p>

                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="space-y-5 mb-10">

                        <div className="bg-green-100 border-l-4 border-green-600 rounded-xl p-5 flex items-center gap-4">
                            <ShieldAlert className="text-green-700" />
                            <p className="text-green-700 font-medium">
                                Report successfully submitted to Command Center
                            </p>
                        </div>

                        <div className="bg-red-100 border-l-4 border-red-600 rounded-xl p-5 flex items-center gap-4">
                            <TriangleAlert className="text-red-700" />
                            <p className="text-red-700 font-medium">
                                Please specify the disaster location
                            </p>
                        </div>

                    </div>

                    {/* FORM CARD */}
                    <div className="bg-white rounded-3xl shadow-sm p-12 max-w-5xl mx-auto">

                        {/* GRID */}
                        <div className="grid grid-cols-2 gap-10 mb-10">

                            {/* DISASTER TYPE */}
                            <div>

                                <label className="block text-blue-950 font-semibold mb-4 uppercase text-sm">
                                    Disaster Type
                                </label>

                                <select className="w-full bg-gray-100 rounded-xl px-5 py-4 outline-none text-gray-700">
                                    <option>Select emergency type</option>
                                    <option>High</option>
                                    <option>Moderate</option>
                                    <option>Low</option>
                                </select>

                            </div>

                            {/* LOCATION */}
                            <div>

                                <label className="block text-blue-950 font-semibold mb-4 uppercase text-sm">
                                    Location
                                </label>

                                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-4 mb-4">
                                    <MapPin className="text-blue-900 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Enter address or landmark"
                                        className="bg-transparent outline-none w-full"
                                    />
                                </div>

                                {/* GOOGLE MAP */}
                                <iframe
                                    title="map"
                                    className="w-full h-52 rounded-xl"
                                    src="https://maps.google.com/maps?q=Sri Lanka&t=&z=7&ie=UTF8&iwloc=&output=embed"
                                ></iframe>

                            </div>

                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-10">

                            <label className="block text-blue-950 font-semibold mb-4 uppercase text-sm">
                                Description
                            </label>

                            <textarea
                                rows="6"
                                placeholder="Describe the situation, number of people involved, and immediate dangers..."
                                className="w-full bg-gray-100 rounded-xl p-5 outline-none resize-none"
                            ></textarea>

                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mb-12">

                            <label className="block text-blue-950 font-semibold mb-4 uppercase text-sm">
                                Optional Image Upload
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 flex flex-col items-center justify-center text-center">

                                <div className="bg-blue-100 p-4 rounded-xl mb-6">
                                    <Upload className="text-blue-900" size={35} />
                                </div>

                                <p className="font-semibold text-lg mb-2">
                                    Click to upload or drag and drop
                                </p>

                                <p className="text-gray-500 text-sm">
                                    PNG, JPG or HEIC (max. 10MB)
                                </p>

                                <input type="file" className="mt-6" />

                            </div>

                        </div>

                        {/* BUTTON */}
                        <button className="w-full bg-teal-600 hover:bg-teal-700 transition-all duration-300 text-white py-5 rounded-xl text-xl font-semibold flex items-center justify-center gap-3">

                            <Send size={22} />

                            Submit Report

                        </button>

                        <p className="text-center text-gray-400 tracking-[0.3em] text-xs mt-8">
                            YOUR DATA IS ENCRYPTED AND SENT DIRECTLY TO EMERGENCY SERVICES
                        </p>

                    </div>

                    {/* BOTTOM CARDS */}
                    <div className="grid grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto">

                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <ShieldAlert className="text-blue-900 mb-5" />

                            <h3 className="font-bold text-2xl mb-3">
                                Need Immediate Help?
                            </h3>

                            <p className="text-gray-600 leading-8">
                                If you are in life-threatening danger, call 911 immediately.
                            </p>

                        </button>

                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <MapPin className="text-blue-900 mb-5" />

                            <h3 className="font-bold text-2xl mb-3">
                                Safe Zones
                            </h3>

                            <p className="text-gray-600 leading-8">
                                View nearest evacuation centers and medical outposts.
                            </p>

                        </button>

                        <button className="bg-white rounded-2xl p-8 text-left hover:shadow-lg transition-all duration-300">

                            <TriangleAlert className="text-blue-900 mb-5" />

                            <h3 className="font-bold text-2xl mb-3">
                                Live Alerts
                            </h3>

                            <p className="text-gray-600 leading-8">
                                Stay updated with real-time broadcast messages from HQ.
                            </p>

                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Report;