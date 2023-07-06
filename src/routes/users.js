import express from 'express'

import User from '../../models/User.js'

const router = express.Router()

router.get('/', (_, res) => {
	// Este proceso lo hacemos para poder devolver los datos de la base de datos con el método toJSON() que nos permite eliminar y manipular los datos. Esto lo hicimos en el modelo User.js
	User.find({}).then(users => {
		res.json(
			users.map(user => {
				return user.toJSON()
			})
		)
	})
})

router.get('/:id', (req, res, next) => {
	const { id } = req.params

	User.findById(id)
		.then(user => {
			if (user) {
				return res.json(user.toJSON())
			} else {
				res.status(404).json({ message: 'User not found' })
				return
			}
		})
		.catch(next)
})

router.post('/', (req, res, next) => {
	const user = req.body

	if (!user.name || !user.email || !user.password) {
		res.status(400).json({ message: 'Missing fields' })
		return
	}

	User.findOne({ email: user.email }).then(user => {
		if (user) return res.status(400).json({ message: 'User already exists' })
	})

	// De esta forma podemos manipular los datos antes de guardarlos en la base de datos, por ejemplo, encriptaremos la contraseña posteriormente
	const newUser = new User({
		name: user.name,
		email: user.email,
		password: user.password,
		balance: user.balance || 0,
		movements: user.movements || [],
	})

	newUser
		.save()
		.then(() => {
			res.status(201).json({ message: 'User created' })
		})
		.catch(next)
})

router.put('/:id', (req, res, next) => {
	const { id } = req.params

	const user = req.body

	if (!user.name || !user.email || !user.password) {
		res.status(400).json({ message: 'Missing fields' })
		return
	}

	// Mongoose nos facilita el actualizar los datos de un documento, ya que no debemos hacerlo con el $set como en MongoDB nativo. Este actualizara solo los datos que se hayan modificado
	User.findByIdAndUpdate(id, user)
		.then(() => {
			return res.status(200).json({ message: 'User updated' })
		})
		.catch(next)
})

router.delete('/:id', (req, res, next) => {
	const { id } = req.params

	User.findByIdAndDelete(id)
		.then(result => {
			if (!result) {
				res.status(404).json({ message: 'User not found' })
				return
			}

			// Si vamos a devolver como en mi caso un json, el 200 es el código recomendado. Si no vamos a enviar nada podemos usar el 204
			return res.status(200).json({ message: 'User deleted' })
		})
		.catch(next)
})

export default router
