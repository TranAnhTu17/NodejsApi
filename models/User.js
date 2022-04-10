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
        console.log("password", this.password);
        const salt = await bcrypt.genSalt(10);
        console.log("salt", salt);

        const passwordHashed = await bcrypt.hash(this.password, salt);
        console.log("passwordHashed", passwordHashed);

        this.password = passwordHashed;
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
