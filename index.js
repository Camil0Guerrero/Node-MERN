import express from 'express'
import cors from 'cors'
import router from './src/routes/users.js'
import session from './src/routes/session.js'

const app = express()
const PORT = 8081

app.use(express.json())
app.use(cors())

app.use('/', session)
app.use('/api/users', router)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
