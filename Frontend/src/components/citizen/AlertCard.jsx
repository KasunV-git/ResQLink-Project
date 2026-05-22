const AlertCard = ({ alert }) => {
    return (
        <div
            className={`bg-white rounded-2xl p-6 border-l-8 ${alert.color}`}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-bold tracking-widest text-gray-500">
                        {alert.severity}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">{alert.title}</h3>

                    <p className="text-gray-600 mt-3">{alert.message}</p>
                </div>

                <p className="text-gray-500">{alert.time}</p>
            </div>
        </div>
    );
};

export default AlertCard;