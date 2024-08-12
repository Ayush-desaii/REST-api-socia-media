import user from "../models/user.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    let users;
    try{
        users = await user.find();

    } catch(err) {
        console.log(err);
    }

    if (!users) {
        return res.status(404).json({message:"no user found"});
    }
    return res.status(200).json({users})
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user.findOne({email});
    } catch (error) {
        console.log(error);
    }
    if(existingUser) {
        res.status(400).json({message:"user already exist!! try login"})
    }

    const hashedPassword = bcrypt.hashSync(password);

    const userr = new user({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });
    try {
        await userr.save();
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({userr})

}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await user.findOne({email});
    } catch (error) {
        console.log(error);
    }
    if(!existingUser) {
        res.status(404).json({message:"user not found!! please signup"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({message:"incorrect password"})
    }
    return res.status(200).json({message:"login successfull"})
}