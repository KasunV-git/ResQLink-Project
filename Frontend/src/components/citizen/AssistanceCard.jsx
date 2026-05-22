const AssistanceCard = () => {
    return (
        <div className="bg-white rounded-2xl p-8 flex justify-between items-center shadow-sm">
            <div>
                <h2 className="text-3xl font-bold mb-3">
                    Immediate Assistance
                </h2>

                <p className="text-gray-600 text-lg">
                    Spotted a hazard or emergency? Inform the network instantly.
                </p>
            </div>

            <button className="bg-teal-600 text-white px-10 py-6 rounded-2xl text-2xl font-bold">
                Report Disaster
            </button>
        </div>
    );
};

export default AssistanceCard;