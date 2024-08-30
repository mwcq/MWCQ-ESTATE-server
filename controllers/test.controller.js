import jwt from 'jsonwebtoken'

export const shouldBeloggedIn = async (req, res) => {
    console.log(req.userId);
    res.status(200).send({ message: 'You are logged in' })
}

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).send({ message: 'You are not logged in' })
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(403).send({ message: 'You are not logged in' })
        }
        if (!payload.isAdmin) {
            return res.status(403).send({ message: 'You are not an admin' })
        }
    })
    res.status(200).send({ message: 'You are logged in' })
}