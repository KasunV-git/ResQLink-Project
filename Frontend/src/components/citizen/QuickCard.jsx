const QuickCard = ({ title, desc }) => {
    return (
        <div className="bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div>
                <h3 className="text-xl font-bold mb-1">
                    {title}
                </h3>

                <p className="text-gray-500">
                    {desc}
                </p>
            </div>

            <span className="text-3xl text-gray-400">
                ›
            </span>
        </div>
    );
};

export default QuickCard;