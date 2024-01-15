const forwardParam = (paramName) => (req, res, next) => {
    req[paramName] = req.params[paramName];

    next();
};

module.exports = { forwardParam };