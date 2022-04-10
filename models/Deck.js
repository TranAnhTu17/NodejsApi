const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    total: {
        type: Number,
        default: 0,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Deck = mongoose.model("Deck", UserSchema);
module.exports = Deck;
