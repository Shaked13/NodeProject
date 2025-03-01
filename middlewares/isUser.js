export const isUser = (req, res, next) => {
    if (req.user._id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json(
            { message: "You are not allowed to perform this action, you are not the authorized user!!!" }
        );
    }
    return next();
}