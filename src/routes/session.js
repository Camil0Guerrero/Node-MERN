import { Router } from 'express'
import User from '../../models/User.js'

const session = Router()

session.post('/login', (req, res) => {
	const { email, password } = req.body

	User.findOne({ email }).then(user => {
		if (user) {
			if (user.password === password) {
				res.status(200).json(user)
			} else {
				res.status(400).json({ message: 'Invalid credentials' })
			}
		} else {
			res.status(400).json({ message: 'Invalid credentials' })
		}
	})
})

export default session
