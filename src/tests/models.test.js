import { describe, test, expect } from 'vitest'
import User from '../models/User.js'
import { api, initialMovements, initialUsers } from './helpers.js'
import bcrypt from 'bcryptjs'
import Movement from '../models/Movements.js'

describe('User model', () => {
	test('Delete Users', async () => {
		await User.deleteMany({})
		const users = await User.find({})

		expect(users).toHaveLength(0)
	})

	test('Create initial users', async () => {
		for (const user of initialUsers) {
			const passwordHash = bcrypt.hashSync(user.password, 10)

			const newUser = new User({
				name: user.name,
				email: user.email,
				password: passwordHash,
			})

			await newUser.save()
		}

		const users = await User.find({})
		expect(users).toHaveLength(initialUsers.length)
	})

	test('Users return Json', async () => {
		api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('Find all users', async () => {
		const response = await api.get('/api/users')

		expect(response.body).toHaveLength(initialUsers.length)
	})

	test('Find user by id', async () => {
		const user = await User.findOne({ email: initialUsers[0].email })
		const response = await api.get(`/api/users/${user._id}`)

		expect(response.body.name).toBe(initialUsers[0].name)
	})

	test('Find user with invalid id', async () => {
		await api.get('/api/users/123456789').expect(400)
	})

	test('Update user by id', async () => {
		const user = await User.findOne({ email: initialUsers[0].email })

		const newUser = {
			name: 'New name',
		}

		user.name = newUser.name
		await user.save()

		const userUpdate = await User.find({ email: initialUsers[0].email })
		expect(userUpdate[0].name).toBe(newUser.name)
	})

	test('Update user with invalid id', async () => {
		await api.put('/api/users/123456789').expect(400)
	})

	test('Delete user by id', async () => {
		const user = await User.findOne({ email: initialUsers[0].email })

		await User.findByIdAndDelete(user._id)

		const users = await User.find({})

		expect(users).toHaveLength(initialUsers.length - 1)
	})

	test('Delete user with invalid id', async () => {
		await api.delete('/api/users/123456789').expect(400)
	})
})

describe('Movement model', () => {
	test('Delete movements', async () => {
		await Movement.deleteMany({})
		const movements = await Movement.find({})
		expect(movements).toHaveLength(0)
	})

	test('Create initial movements', async () => {
		const user = await User.findOne({ email: initialUsers[1].email })

		api
			.post('/api/movements')
			.send({
				id: user._id,
				amount: 100,
				type: 'transfer',
				description: 'Salary',
				email: user.email,
			})

			.expect(201)

		const movements = await Movement.find({})
		console.log(movements)
		expect(movements).toHaveLength(initialMovements.length)
	})
})
