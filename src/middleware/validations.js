import mongoose from 'mongoose'

const operations = {
	balance: balance => {
		const balanceNumber = Number(balance)

		if (!balanceNumber) return false
		if (balanceNumber < 1000) return false

		const regExp = /^([0-9]{1,5})$/
		return regExp.test(balance)
	},
	description: description => {
		const descriptionRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,30}$/
		return descriptionRegex.test(description)
	},
	email: email => {
		const emailRegex = /^[a-zA-Z0-9_.+-]+@(gmail|hotmail|outlook)+\.(com|es)$/
		return emailRegex.test(email)
	},
	id: id => {
		return mongoose.Types.ObjectId.isValid(id)
	},
	destination: destination => {
		const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,30}$/
		return nameRegex.test(destination)
	},
	password: password => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
		return passwordRegex.test(password)
	},
}

function validations(req, res, next) {
	const { amount, balance, description, email, destination, password, type } = req.body

	if (amount) {
		if (!operations.balance(amount)) {
			return res.status(400).json({ error: 'Invalid amount' })
		}
	}

	if (balance) {
		if (!operations.balance(balance)) {
			return res.status(400).json({ error: 'Invalid balance' })
		}
	} else {
		req.balance = 0
	}

	if (description) {
		if (!operations.description(description)) {
			return res.status(400).json({ error: 'Invalid description' })
		}
	}

	if (email) {
		if (!operations.email(email)) {
			return res.status(400).json({ error: 'Invalid email' })
		}
	}
	if (destination) {
		if (!operations.destination(destination)) {
			return res.status(400).json({ error: 'Invalid Destination' })
		}
	}

	if (password) {
		if (!operations.password(password)) {
			return res.status(400).json({ error: 'Invalid password' })
		}
	}

	if (type) {
		if (!['transfer'].includes(type)) {
			res.status(400).json({ message: 'Invalid type' })
			return
		}
	}

	next()
}

export default validations
