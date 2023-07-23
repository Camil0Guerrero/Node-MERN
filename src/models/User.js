import { Schema, model } from 'mongoose'

// El email sera nuestra clave primaria, para ello debemos indicarlo en el esquema con unique: true
const userSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true,
	},
	password: String,
	balance: Number,
})

userSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.password
	},
})

// Lo mejo al dar el nombre a nuestro model es hacerlo con la primera en mayúscula y en singular. de esta forma, nuestra colección se llamara Users. Digamos que es un estándar en mongoDB
const User = model('User', userSchema)

export default User
