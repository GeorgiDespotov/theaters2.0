module.exports = (req, res, next) => {
    req.storage = {};
    next();
};