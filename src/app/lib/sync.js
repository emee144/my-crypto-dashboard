import sequelize from "./sequelize.js";
import User from "./models/user.js"; 

(async () => {
  try {
    console.log("🔄 Syncing database...");

    await sequelize.sync({ alter: true }); // Use { force: true } to drop & recreate tables

    console.log("✅ Database synchronized successfully.");
    process.exit(); // Exit process after successful sync
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
    process.exit(1); // Exit process with error code
  }
})();