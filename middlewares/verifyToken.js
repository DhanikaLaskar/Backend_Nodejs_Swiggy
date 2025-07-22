const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.WhatIsYourName; // Ensure this matches the key used in vendorController.js

const verifyToken = async(req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token,secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        req.vendorId = vendor._id;

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = verifyToken;