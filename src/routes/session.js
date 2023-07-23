import { Router } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const session = Router()

session.post('/login', async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		res.status(400).json({ message: 'Missing fields' })
		return
	}

	const user = await User.findOne({ email })
	const validPassword = user ? await bcrypt.compare(password, user.password) : null

	if (!user || !validPassword) {
		res.status(401).json({ message: 'Invalid email or password' })
		return
	}

	const userForToken = {
		id: user._id,
	}

	// Guardaremos la sesión de nuestro usuario usando json web token, es importante que el segundo parámetro lo tratemos como si fuese una contraseña, es decir lo mas larga y compleja posible ya que esta es la que nos da la seguridad
	const token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 60 * 60 * 24,
	})

	console.log(token)
	// En este caso no es necesario hacer el map y el toJSON() ya que el método json() lo hace por internamente
	res.status(200).json({ token, user })
})

export default session
