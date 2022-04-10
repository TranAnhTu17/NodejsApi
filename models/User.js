const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    decks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Deck",
        },
    ],
});

UserSchema.pre("save", async function (next) {
    // theo ly thuyet:
    // this refers to the document being updated.
    try {
        const salt = await bcrypt.genSalt(10);

        const passwordHashed = await bcrypt.hash(this.password, salt);

        this.password = passwordHashed;

        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
