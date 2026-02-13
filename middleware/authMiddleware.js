const authMiddleware = async(req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/usersignin');
    }
};

module.exports = {authMiddleware};
