const { Disaster, User } = require('./src/models');

async function test() {
    try {
        const reports = await Disaster.findAll({
            include: [{ model: User, as: 'reporter', attributes: ['name', 'role'] }],
            order: [['created_at', 'DESC']],
        });
        console.log("Success! Found", reports.length, "reports");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}
test();
