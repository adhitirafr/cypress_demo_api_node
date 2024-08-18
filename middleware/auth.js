import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: '401: Unauthorized. Please login with correct user'
        })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: '403: Forbidden. Please login with correct user'
            })
        }
        req.user = user
        next()
    })
}