import supertest from 'supertest'
import app from '../..'

export const api = supertest(app)

export const initialUsers = [
	{
		name: 'Camilo',
		email: 'camilo@gmail.com',
		password: 'Ca123456',
	},
	{
		name: 'Juan',
		email: 'Juan@gmail.com',
		password: 'Ca123456',
	},
]

export const initialMovements = [
	{
		amount: 100,
		type: 'income',
		description: 'Salary',
	},
]
