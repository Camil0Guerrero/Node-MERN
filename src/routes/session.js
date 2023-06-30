import { Router } from 'express'
import users, { session as sessionData } from '../data.js'

const session = Router()

session.post('/login', (req, res) => {
	const { email, password, ip } = req.body
	console.log(req.body)

	const validation = users.find(
		user => user.email === email && user.password === password
	)

	if (validation) {
		sessionData.push({ ip, id: validation.id })
		res.status(200).json(validation)
	} else res.status(400).json({ message: 'Invalid credentials' })
})

session.post('/session', (req, res) => {
	const { ip, id } = req.body

	const validation = sessionData.find(session => session.ip === ip)

	if (validation) {
		const user = users.find(user => user.id === validation.id)
		res.status(200).json(user)
		return
	}

	if (!id) {
		res.status(204).json({ message: 'Without session' })
		return
	}

	sessionData.push({ ip, id })
	res.status(200).json({ message: 'Session created' })
})

session.delete('/session', (req, res) => {
	const { ip } = req.body

	const validation = sessionData.find(session => session.ip === ip)

	if (validation) {
		const sessionIndex = sessionData.findIndex(session => session.ip === ip)
		sessionData.splice(sessionIndex, 1)
		res.status(200).json({ message: 'Session deleted' })
	} else res.status(204).json({ message: 'Session not found' })
})

export default session
