const express = require("express");
// const router = express.Router();
const router = require("express-promise-router")();
const userController = require("../controllers/user");

const passport = require("passport");
require("../middlewares/passport");

const {
    validateBody,
    validateParam,
    schemas,
} = require("../helpers/routeHelpers");

router
    .route("/")
    .get(userController.index)
    .post(validateBody(schemas.userSchema), userController.newUser);

router
    .route("/signup")
    .post(validateBody(schemas.authSignUpSchema), userController.signUp);
router
    .route("/signin")
    .post(
        validateBody(schemas.authSignInSchema),
        passport.authenticate("local", { session: false }),
        userController.signIn
    );
router
    .route("/secret")
    .get(
        passport.authenticate("jwt", { session: false }),
        userController.secret
    );

router
    .route("/:userID")
    .get(validateParam(schemas.idSchema, "userID"), userController.getUser)
    .put(
        validateParam(schemas.idSchema, "userID"),
        validateBody(schemas.userOptionalSchema),
        userController.replaceUser
    )
    .patch(
        validateParam(schemas.idSchema, "userID"),
        validateBody(schemas.userOptionalSchema),
        userController.updateUser
    );

router
    .route("/:userID/decks")
    .get(validateParam(schemas.idSchema, "userID"), userController.getUserDecks)
    .post(
        validateParam(schemas.idSchema, "userID"),
        validateBody(schemas.deckSchema),
        userController.newUserDeck
    );

module.exports = router;
