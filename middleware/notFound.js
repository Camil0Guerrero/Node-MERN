function notFound(_, res) {
	res.status(404).json({
		message: 'Not found',
	})
}

export default notFound
