const mongoose = require("mongoose");

const authSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "First name is required"]
        },
        lastname: {
            type: String,
            required: [true, "Last name is required"]
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                "Email is invaild"
            ]
        },
        // --- 2. Auth Method Tracking ---
        authProvider: {
            type: String,
            enum: ["local", "google"],
            required: true,
            default: "local"
        },
        googleId: {
            type: String,
            unique: [true, "Google ID must be unique"],
            sparse: true
        },
        profilePicture: {
            type: String
        },

        password: {
            type: String,
            select: false,
            minLength: [6, "Password atleast 6 charector"],
            required: function () {
                return this.authProvider === "local";
            }
        }
    },
    { timestamps: true }
);

const authModel = mongoose.model("Fullstack_GenAi_user", authSchema);

module.exports = authModel;
