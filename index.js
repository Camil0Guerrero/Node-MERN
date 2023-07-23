import 'dotenv/config.js'
import './connectDB.js'
import express from 'express'
import cors from 'cors'
import router from './src/routes/users.js'
import session from './src/routes/session.js'
import notFound from './src/middleware/notFound.js'
import handleErrors from './src/middleware/handleErrors.js'
import movements from './src/routes/movements.js'

const app = express()

const { PORT, PORT_TEST, NODE_ENV } = process.env
const portDB = NODE_ENV === 'test' ? PORT_TEST : PORT

app.use(express.json())
app.use(cors())

app.use('/api', session)
app.use('/api/users', router)
// app.use('/api/movements', movements)
app.use('/api/movements', movements)
app.use(notFound)
app.use(handleErrors)

app.listen(portDB, () => {
	console.log(`Server is running on port ${portDB}`)
})

export default app
