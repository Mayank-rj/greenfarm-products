const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send({ success: false, message: "Authorization header is missing" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ success: false, message: "Token is missing" });
    }

    if (token !== process.env.API_TOKEN) {
        return res.status(401).send({ success: false, message: "Invalid API Token" });
    }

    next();
};

module.exports = authenticateToken;
