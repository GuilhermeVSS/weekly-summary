const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../../config/auth');

class SessionController {

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const [foundUser] = await User.find({ email: email });

            if (!foundUser) {
                res.status(404).json({ message: "User not found" });
            }

            if (!bcrypt.compareSync(password, foundUser.password_hash)) {
                res.status(400).json({message: "Password and User does not match. Try again"});
            }

            res.status(200).json({
                user: {
                    email: email
                },
                token: jwt.sign({ email }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn
                })
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Something went wrong. Please try again later"});
        }
    }
}

module.exports = new SessionController();