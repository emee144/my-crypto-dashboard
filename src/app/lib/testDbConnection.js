// Debugging logs
console.log("Current directory:", __dirname);
console.log("Importing sequelize.js from:", "./sequelize.js");
console.log("Importing user model from:", "./models/user.js");

import sequelize from "./sequelize.js";  // Correct path to sequelize.js in the same lib folder
import User from "./models/user.js";  // Correct path to user.js in the models folder inside lib
import './sync.js';  // Explicit file extension

(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // Sync models (optional, only if you need to apply migrations)
    await sequelize.sync({ alter: true }); // Use { force: false } or { alter: true } for non-destructive sync
    console.log("✅ Database synchronized successfully.");

    // Test inserting a new user (basic insert test)
    const newUser = await User.create({
      email: "testuser@example.com",
      password: "hashedpassword123", // For testing, use a hashed password if your model expects it
    });
    console.log("✅ New user created:", newUser.id, newUser.email);

    // Test querying users (basic select test)
    const users = await User.findAll();
    console.log("✅ All users:", users);

  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();