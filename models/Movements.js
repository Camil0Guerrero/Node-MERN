import { Schema, model } from 'mongoose'

const MovementSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, ref: 'User' },
	movements: [
		{
			amount: { type: Number, required: true },
			date: { type: Date, required: true },
			description: { type: String, required: false },
			name: { type: String, required: true },
			type: { type: String, required: true },
		},
	],
})

const Movement = model('Movement', MovementSchema)

export default Movement
