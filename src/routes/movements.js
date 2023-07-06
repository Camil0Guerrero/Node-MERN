import express from 'express'
import User from '../../models/User.js'
import Movement from '../../models/Movements.js'

const movements = express.Router()

movements.post('/', (req, res, next) => {
	const { amount, description, email, type } = req.body

	if (!+amount || !description || !email || !type) {
		res.status(400).json({ message: 'Missing' })
		return
	}

	if (!['transfer'].includes(type)) {
		res.status(400).json({ message: 'Invalid type' })
		return
	}

	// En este caso creo que lo mejor era hacerlo de esta forma ya que necesitaba hacer la validaciones, usando then y catch se complicaba mas y era menos legible
	const transfer = async () => {
		try {
			const user = await User.findOne({ email }).then(response =>
				response.toJSON()
			)

			if (user) {
				const movement = await Movement.findById({ _id: user.id }).then(
					movement => movement.toJSON()
				)

				if (movement) {
					movement.movements.push({
						amount: +amount,
						date: new Date(),
						description,
						name: user.name,
						type,
					})

					await User.findByIdAndUpdate(
						{ _id: user.id },
						{
							balance: user.balance + amount,
						}
					).catch(next)

					await Movement.findByIdAndUpdate(
						{ _id: user.id },
						{
							movements: movement.movements,
						}
					).catch(next)

					console.log('Transfer successful')
					res.status(200).json({ message: 'Transfer successful' })
					return
				} else {
					await Movement.create({
						_id: user._id,
						movements: [
							{
								amount: +amount,
								date: new Date(),
								description,
								name: user.name,
								type,
							},
						],
					}).catch(next)

					user.balance += amount
					await user.save().catch(next)

					console.log('Created movement and transfer')
					res.status(200).json({ message: 'Transfer successful' })
					return
				}
			} else {
				res.status(404).json({ message: 'User not found' })
				return
			}
		} catch (error) {
			next(error)
		}
	}

	transfer()
})

movements.get('/', (req, res) => {
	const { id } = req.params

	Movement.find({ _id: id }).then(movements => {
		if (!movements) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json(
			movements.map(movement => {
				return movement.toJSON()
			})
		)
	})
})

export default movements
