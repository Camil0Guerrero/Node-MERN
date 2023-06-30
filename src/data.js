const users = [
	{
		id: 1,
		name: 'John Doe',
		password: '123456',
		email: 'John_doe@gmail.com',
		balance: 1000,
		movements: [],
	},
	{
		id: 2,
		name: 'chris',
		password: '123456',
		email: 'chris_23@gmail.com',
		balance: 100,
		movements: [],
	},
	{
		id: 3,
		name: 'jane',
		password: 'Ca234567',
		email: 'jane_67@gmail.com',
		balance: 10000,
		movements: [
			{
				date: '2021-08-01T00:00:00.000Z',
				amount: 1000,
				description: 'Salary',
				destination: 'John Doe',
			},
		],
	},
]

export const session = [{ ip: '181.204.231.35', id: 1 }]

export default users
