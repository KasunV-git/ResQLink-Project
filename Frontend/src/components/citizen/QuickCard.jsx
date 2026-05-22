const QuickCard = ({ title, desc }) => {
    return (
        <div className="bg-white rounded-2xl p-6 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{desc}</p>
            </div>

            <span className="text-2xl">›</span>
        </div>
    );
};

export default QuickCard;