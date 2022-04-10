const Deck = require("../models/Deck");
const User = require("../models/User");
class DeckController {
    async index(req, res, next) {
        const decks = await Deck.find({});
        // throw new Error("random error");
        return res.status(200).json({ decks });
    }
    async newDeck(req, res, next) {
        const owner = await User.findById(req.value.body.owner);

        const deck = req.value.body;
        delete deck.owner;
        deck.owner = owner._id;

        const newDeck = new Deck(deck);
        await newDeck.save();

        owner.decks.push(newDeck._id);
        await owner.save();

        return res.status(201).json({ deck: newDeck });
    }

    async getDeck(req, res, next) {
        const { deckID } = req.value.params;
        const deck = await Deck.findById(deckID);

        return res.status(200).json({ deck });
    }
    async replaceDeck(req, res, next) {
        const { deckID } = req.value.params;

        const newDeck = req.value.body;

        const result = await Deck.findByIdAndUpdate(deckID, newDeck);

        // check if put user, remove deck in user's model

        return res.status(200).json({ success: true });
    }
    async updateDeck(req, res, next) {
        const { deckID } = req.value.params;

        const newDeck = req.value.body;

        const result = await Deck.findByIdAndUpdate(deckID, newDeck);

        // check if put user, remove deck in user's model

        return res.status(200).json({ success: true });
    }
    async deleteDeck(req, res, next) {
        const { deckID } = req.value.params;

        const deck = await Deck.findById(deckID);
        const ownerID = deck.owner;

        const owner = await User.findById(ownerID);

        await deck.remove();

        owner.decks.pull(deck);
        await owner.save();

        return res.status(200).json({ success: true });
    }
}
module.exports = new DeckController();
