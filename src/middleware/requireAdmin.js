const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin'){
        res.status(403).json({error: 'Admin access required'})
        return
    }
    next()
}

export default requireAdmin
