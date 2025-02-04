import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateToken = (userId, res) => {

const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true, // cookie cannot be accessed by client side javascript
        sameSize: "strict", // cookie will only be sent in https
        secure: process.env.NODE_ENV !== "development",

    });

    console.log("Token:== ", token);
    return token;
};