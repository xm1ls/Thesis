import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken } from '../lib/utils.js'


export const signup = async (req, res) => {
    const { name, password } = req.body
    try {
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password minimum length is 8 characters"
            })
        }

        const user = await User.findOne({ name })

        if (user) return res.status(400).json({
            message: "User with this name already exists"
        })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                name: newUser.name,
                message: "User created"
            })
        }
        else {
            res.status(400).json({
                message: "Invalid user data"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const login = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({name})
        
        if(!user) return res.status(400).json({
            message: "Invalid credentials"
        })

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) return res.status(400).json({
            message: "Invalid credentials"
        })

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            message: "Logged in"
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({
            massage: "Something went wrong"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({
            message: "Logged out"
        })
    } catch(error) {
        console.log(error)
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error) {
        console.log(error)
    }
}