const adminMiddleware = (req, res, next) => {
    if(req.user.role !== "Admin"){
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin Only!"
        });
    }
    next();
}

module.exports = adminMiddleware;