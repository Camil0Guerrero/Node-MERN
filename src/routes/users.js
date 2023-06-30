import express from 'express'

import users from '../data.js'

const router = express.Router()

router.get('/', (_, res) => {
	res.status(200).json(users)
})

router.get('/:id', (req, res) => {
	const id = +req.params.id,
		user = users.find(user => user.id === id)

	if (!user) {
		res.status(404).json({ message: `User with id ${id} not found` })
		return
	}

	res.status(200).json(user)
})

router.post('/movements', (req, res) => {
	if (!req.body.id) {
		res.status(400).json({ message: 'Missing id' })
		return
	}

	const id = +req.body.id,
		movements = users.find(user => user.id === id)?.movements

	if (!movements) {
		res.status(401).json({ message: 'User not found' })
	}

	res.status(200).json(movements)
})

router.post('/', (req, res) => {
	const newUser = req.body,
		id = Math.max(...users.map(user => user.id)) + 1

	newUser.id = id
	users.push(newUser)

	res.status(201).json(users)
})

router.put('/:id', (req, res) => {
	const id = parseInt(req.params.id),
		userIndex = users.findIndex(user => user.id === id)

	if (userIndex === -1) {
		res.status(404).json({ message: `User with id ${id} not found` })
		return
	}

	users[userIndex] = { ...users[userIndex], ...req.body }

	res.status(200).json({ message: 'User updated' })
})

router.delete('/:id', (req, res) => {
	const id = +req.params.id,
		userIndex = users.findIndex(user => user.id === id)

	if (userIndex === -1) {
		res.status(404).json({ message: `User with id ${id} not found` })
		return
	}

	users.splice(userIndex, 1)
	res.status(200).json({ message: 'User deleted' })
})

export default router
