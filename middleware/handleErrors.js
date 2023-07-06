function handleErrors(error, req, res) {
	console.log(error)
	console.log(error.name)

	if (error.name === 'CastError') {
		res.status(400).json({ message: 'Invalid id' })
		return
	}

	res.status(500).json({ message: 'Internal server error' })
}

export default handleErrors
