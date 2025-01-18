const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); // Add this import

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Add other fields if necessary
});

// Apply the passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
