import Movement from '../models/Movements.js'

async function AddMovement({ id, amount, description, destination, type }) {
	try {
		const movements = await Movement.findById(id)
		if (!movements) {
			const newMovements = new Movement({
				_id: id,
				movements: [
					{
						amount: +amount,
						date: new Date(),
						description,
						destination,
						type,
					},
				],
			})

			await newMovements.save()
		}

		movements.movements.push({
			amount: +amount,
			date: new Date(),
			description,
			destination,
			type,
		})

		await movements.save()
	} catch (error) {
		console.log('Error al agregar el movimiento', error)
	}
}

export default AddMovement
