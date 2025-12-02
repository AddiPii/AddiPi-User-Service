const requireUser = (req, res,) => {
    if (!req.user){
        res.status(403).json({error: 'Authentication required'})
        return
    }

    getNextJob()
}

export default requireUser
