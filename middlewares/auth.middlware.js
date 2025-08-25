const asyncHandler = require("../utilities/asyncHandler.utility.js");
const errorHandler = require("../utilities/errorHandler.utility.js");
const jwt = require("jsonwebtoken")

const isAuthenticated = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token || req.headers['authorization']?.replace("Bearer ", "");
    if (!token) {
        return next(new errorHandler("Invalid token", 400))
    }
    const tokenData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = tokenData
    next()
});


module.exports = isAuthenticated;