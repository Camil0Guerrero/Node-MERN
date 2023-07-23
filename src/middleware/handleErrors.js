import mongoose from 'mongoose'

function handleErrors(error, req, res) {
	console.log(error)
	console.log(error.name)

	const id = req.params.id
	if (id) {
		const idValid = mongoose.Types.ObjectId.isValid(id)
		if (!idValid) {
			res.status(400).json({ message: 'Invalid id' })
			return
		}
	}

	if (error.name === 'CastError') {
		res.status(400).json({ message: 'Invalid id' })
		return
	}

	res.status(500).json({ message: 'Internal server error' })
}

export default handleErrors
