const {User} = require('../models/user.model');
const bcrypt = require('bcryptjs');

class UserController {
    store = async(req, res)=>{
        try {
            const {email} = req.body;
            const foundUser = await User.findOne({where:{email:email}});
            if(foundUser){
                return res.status(400).json({message: "User already exists"});
            }
            req.body.password_hash = await bcrypt.hash(req.body.password, 8);
            const user = new User(req.body);
            await user.save();
            return res.status(201).json({message: "User saved successfully"});
        } catch (error) {
            return res.status(500).json({message:"Something went wrong"});            
        }
    }

    insertCredentials = async (req, res) => {
        try {
            const {email} = req.body;//eh pra ser por id
            const [user] = await User.find({email: email});
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            await user.update({$set: req.body});
            return res.status(201).json({message:"Credentials saved succcesfuly"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Error saving credentials"});
        }
    }
}

module.exports = new UserController();