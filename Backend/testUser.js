const { User } = require('./src/models');

async function test() {
    try {
        const user = await User.findOne({ where: { email: 'admin@resqlink.com' } });
        console.log("Success!", user ? user.toJSON() : "Not found");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}
test();
