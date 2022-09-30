import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validateRentalBody(req, res, next) {
	const { customerId, gameId, daysRented } = req.body;

	if (daysRented <= 0) {
		return res.sendStatus(STATUS_CODE.BAD_REQUEST);
	}

	const { error } = schemas.rentalPOST.validate(
		{
			customerId,
			gameId,
			daysRented,
		},
		{ abortEarly: false }
	);
	if (error) {
		const message = error.details.map((detail) => detail.message).join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	try {
		const { rows: categories } = await connection.query(
			`SELECT * FROM "categories" WHERE id = $1;`,
			[customerId]
		);
		const { rows: games } = await connection.query(
			`SELECT * FROM "games" WHERE id = $1;`,
			[gameId]
		);
		if (categories.length === 0 || games.length === 0) {
			return res.sendStatus(STATUS_CODE.BAD_REQUEST);
		}
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}

	next();
}

export { validateRentalBody };
