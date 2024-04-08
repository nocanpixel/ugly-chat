import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: res.statusCode,
            user
        });

    } catch (error) {
        res.status(500).json({
            error: "This account already exists"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const credentialsError = new Error("Email or password is incorrect")
        const user = await User.findOne({ where: { email } });
        if (!user) throw credentialsError;

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw credentialsError;

        const token = jwt.sign({ email: email, name: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.cookie("auth", token, {
            maxAge: 1000 * 60,
            httpOnly: true,
            secure:true,
            sameSite: "lax"
        });

        res.send({message:"User logged"});

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("auth");
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const getUserAuthentication = async (req, res) => {
    try {
        const userAuth = req.user;
        if(userAuth){
            res.status(201).json({
                status: res.statusCode,
                res: {
                    name: userAuth.email,
                    email: userAuth.name,
                    exp: userAuth.exp,
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username', 'email', 'password']
        });
        if (!res.headersSent) {
            res.status(201).json({
                status: res.statusCode,
                users
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

export {
    login,
    register,
    getAll,
    logout,
    getUserAuthentication
};