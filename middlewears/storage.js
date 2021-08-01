const playServices = require('../services/play');



module.exports = () => (req, res, next) => {
    req.storage = {
        ...playServices
    };
    next();
};