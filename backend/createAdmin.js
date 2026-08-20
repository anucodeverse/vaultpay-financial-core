const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            "Admin@12345",
            10
        );

        const existingAdmin = await User.findOne({
            email: "admin@vaultpay.com"
        });

        if (existingAdmin) {
            existingAdmin.name = "VaultPay Admin";
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";

            await existingAdmin.save();

            console.log("Existing user updated to admin successfully");

            console.log({
                id: existingAdmin._id,
                name: existingAdmin.name,
                email: existingAdmin.email,
                role: existingAdmin.role
            });

            process.exit(0);
        }

        const admin = await User.create({
            name: "VaultPay Admin",
            email: "admin@vaultpay.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");

        console.log({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });

        process.exit(0);

    } catch (error) {
        console.error("Failed to create admin:", error.message);
        process.exit(1);
    }
};

createAdmin();