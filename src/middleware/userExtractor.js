import jwt from 'jsonwebtoken'

function userExtractor(req, res, next) {
	try {
		// De esta forma sacamos el token del header de la petición
		const authorization = req.get('authorization')
		let token = null

		if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
			token = authorization.substring(7)
		}

		if (!token) {
			res.status(401).json({ error: 'token missing' })
			return
		}

		const decodedToken = jwt.verify(token, process.env.SECRET)

		console.log(decodedToken)

		if (!decodedToken.id) {
			res.status(401).json({ error: 'token invalid' })
			return
		}

		req.body.id = decodedToken.id
		next()
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			res.status(401).json({ error: 'token missing or invalid' })
			return
		}

		next(err)
	}
}

export default userExtractor
