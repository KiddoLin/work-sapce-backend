
export function apiAuth(req, res, next) {
    //console.log("info", "isAuthenticated:" + req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    res.status(401).json({success: false, message: '用户未登陆或登陆已经过期!'});
}