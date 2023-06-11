const { User } = require('../models/user.model');
const aggregateHelper = require('../helpers/aggregation.helper');
const bcrypt = require('bcryptjs');
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
class UserController {
    getUsersSpotifyCredentials = async () => {
        const usersCredentials = await User.aggregate(aggregateHelper.getUsersSpotifyCredential());
        return usersCredentials;
    }

    getUsersTwitterCredentials = async () => {
        const usersCredentials = await User.aggregate(aggregateHelper.getUsersTwitterCredentials());
        return usersCredentials;
    }

    store = async (req, res) => {
        try {
            const { email } = req.body;
            const [foundUser] = await User.find({ email: email });
            if (foundUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            req.body.password_hash = await bcrypt.hash(req.body.password, 8);
            const user = new User(req.body);
            await user.save();
            return res.status(201).json({
                message: "User saved successfully",
                user: {
                    email: email,
                },
                token: jwt.sign({ email }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn
                })
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    insertCredentials = async (req, res) => {
        try {
            const { userEmail: email } = req;
            const [user] = await User.find({ email: email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await user.update({ $set: req.body });
            return res.status(201).json({ message: "Credentials saved succcesfuly" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error saving credentials" });
        }
    }
}

module.exports = new UserController();