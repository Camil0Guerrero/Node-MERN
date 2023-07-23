import { Router } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import validations from '../middleware/validations.js'
import userExtractor from '../middleware/userExtractor.js'

const router = Router()

router.get('/', userExtractor, async (req, res, next) => {
	try {
		const { id } = req.body

		const user = await User.findById(id)

		if (!user) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
})

router.post('/', async (req, res, next) => {
	try {
		const { name, email, password, balance = 0 } = req.body

		const validate = validations({ name, email, password, balance })
		if (validate.name || validate.email || validate.password || validate.balance) {
			res.status(400).json({ error: validate })
			return
		}

		const userExist = await User.findOne({ email })

		if (userExist) {
			res.status(400).json({ message: 'User already exists' })
			return
		}

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync(10)
		const passwordHash = bcrypt.hashSync(password, salt)

		const newUser = new User({
			name,
			email,
			password: passwordHash,
			balance,
		})

		const userCreated = await newUser.save()

		if (!userCreated) {
			res.status(400).json({ message: 'User not created' })
			return
		}

		res.status(200).json(userCreated)
	} catch (error) {
		next(error)
	}
})

router.put('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		const user = req.body

		const validate = validations({ id, ...user })

		if (validate.id) {
			res.status(400).json({ error: validate.id })
			return
		}

		if (validate.name || validate.email || validate.password || validate.balance) {
			res.status(400).json({ error: validate })
			return
		}

		// Mongoose nos facilita el actualizar los datos de un documento, ya que no debemos hacerlo con el $set como en MongoDB nativo. Este actualizara solo los datos que se hayan modificado
		// El tercer parámetro es para que nos devuelva el documento actualizado
		const userUpdated = await User.findByIdAndUpdate(id, user, { new: true })

		if (!userUpdated) {
			res.status(404).json({ message: 'User not found' })
			return
		}

		res.status(200).json(userUpdated)
	} catch (error) {
		next(error)
	}
})

router.delete('/:id', async (req, res, next) => {
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

export default router
