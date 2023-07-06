import mongoose from 'mongoose'

// En la misma url podemos crear una base de datos nueva, en este caso la llamaremos Mern, si esta ya existe, se conectara a ella
const MONGO_URL = 'mongodb://localhost:27017/Mern'

mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.error('Error connecting to MongoDB: ', error.message)
	})
