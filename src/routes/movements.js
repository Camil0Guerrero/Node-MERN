import { Router } from 'express'
import User from '../models/User.js'
import validations from '../middleware/validations.js'
import userExtractor from '../middleware/userExtractor.js'
import Movement from '../models/Movements.js'
import AddMovement from '../services/AddMovement.js'

const movements = Router()

movements.get('/', userExtractor, async (req, res, next) => {
	try {
		const { id } = req.body

		const movement = await Movement.findById(id)

		if (!movement) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json(movement.movements)
	} catch (error) {
		next(error)
	}
})

movements.post('/', userExtractor, async (req, res, next) => {
	try {
		const { id } = req.body

		const user = await User.findById(id)

		if (!user) {
			res.status(404).json({ message: 'User not found' })
			return
		}
	} catch (err) {
		next(err)
	}
})

movements.put('/transfer', userExtractor, validations, async (req, res, next) => {
	try {
		const { id } = req.body
		const { email, amount, description, type } = req.body

		const userToRecharge = await User.findOne({ email })
		const userToRest = await User.findById(id)

		if (!userToRecharge || !userToRest) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		userToRecharge.balance += +amount
		userToRest.balance -= +amount

		await AddMovement({
			id,
			amount,
			description,
			destination: userToRecharge.name,
			type,
		})

		await userToRecharge.save()
		await userToRest.save()

		res.status(200).json({ message: 'Transfer successfully' })
	} catch (error) {
		next(error)
	}
})

movements.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		const validate = validations({ id })
		if (validate.id) {
			res.status(400).json({ error: validate.id })
			return
		}

		const userDeleted = await User.findByIdAndDelete(id)

		if (!userDeleted) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		// Si vamos a devolver como en mi caso un json, el 200 es el código recomendado. Si no vamos a enviar nada podemos usar el 204
		res.status(200).json({ message: 'User deleted' })
	} catch (error) {
		next(error)
	}
})

export default movements
