const User = require("../models/User");
const Deck = require("../models/Deck");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs/index");

const encodedToken = (userID) => {
    return JWT.sign(
        {
            iss: "TuChan",
            sub: userID,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 3),
        },
        JWT_SECRET
    );
};

class UserController {
    async index(req, res, next) {
        const users = await User.find({});
        // throw new Error("random error");
        return res.status(200).json({ users });
    }
    async newUser(req, res, next) {
        const newUser = new User(req.value.body);
        await newUser.save();
        return res.status(201).json({ user: newUser });
    }
    async getUser(req, res, next) {
        const { userID } = req.value.params;
        const user = await User.findById(userID);

        return res.status(200).json({ user });
    }
    async getUserDecks(req, res, next) {
        const { userID } = req.value.params;

        // join thong qua field decks
        // (trong field decks,nhờ có ref: Deck, nên nó sẽ join ra được deck)
        const user = await User.findById(userID).populate("decks");

        console.log("user decks", user.decks);

        return res.status(200).json({ decks: user.decks });
    }
    async newUserDeck(req, res, next) {
        const { userID } = req.value.params;

        const newDeck = new Deck(req.value.body);

        const user = await User.findById(userID);

        newDeck.owner = user;
        await newDeck.save();

        // chi can push _id vi newDeck la object cua mongo
        user.decks.push(newDeck._id);
        await user.save();

        return res.status(201).json({ deck: newDeck });
    }
    async replaceUser(req, res, next) {
        const { userID } = req.value.params;

        const newUser = req.value.body;

        const result = await User.findByIdAndUpdate(userID, newUser);

        return res.status(200).json({ success: true });
    }
    async updateUser(req, res, next) {
        const { userID } = req.value.params;

        const newUser = req.value.body;

        const result = await User.findByIdAndUpdate(userID, newUser);

        return res.status(200).json({ success: true });
    }
    async signUp(req, res, next) {
        const { firstName, lastName, email, password } = req.value.body;

        const foundUser = await User.findOne({ email });
        if (foundUser)
            return res
                .status(403)
                .json({ error: { message: "email is already in use!" } });

        const newUser = new User({ firstName, lastName, email, password });

        newUser.save();

        const token = encodedToken(newUser._id);

        res.setHeader("Authorization", token);
        return res.status(201).json({ success: true });
    }
    async signIn(req, res, next) {
        console.log("called to signIn");
    }
    async secret(req, res, next) {
        console.log("called to secret");
    }
}
module.exports = new UserController();
