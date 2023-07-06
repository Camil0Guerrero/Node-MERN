import './connectDB.js'
import express from 'express'
import cors from 'cors'
import router from './src/routes/users.js'
import session from './src/routes/session.js'
import movements from './src/routes/movements.js'
import notFound from './middleware/notFound.js'
import handleErrors from './middleware/handleErrors.js'

const app = express()
const PORT = 8081

app.use(express.json())
app.use(cors())

app.use('/api', session)
app.use('/api/users', router)
app.use('/api/movements', movements)
app.use(notFound)
app.use(handleErrors)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
