import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validateRentalBody(req, res, next) {
	const { customerId, gameId, daysRented } = req.body;

	if (daysRented <= 0) {
		return res.sendStatus(STATUS_CODE.BAD_REQUEST);
	}

	const { value: body, error } = schemas.rentalPOST.validate(
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
		const { rows: customer } = await connection.query(
			`SELECT * FROM "customers" WHERE id = $1;`,
			[customerId]
		);
		const { rows: game } = await connection.query(
			`SELECT * FROM "games" WHERE id = $1;`,
			[gameId]
		);

		const invalidReq =
			customer.length === 0 || game.length === 0 || game[0].stockTotal <= 0;
		if (invalidReq) {
			return res.sendStatus(STATUS_CODE.BAD_REQUEST);
		}
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}

	next();
}

async function validadeQueryRental(req, res, next) {
	let { customerId, gameId } = req.query;
	let validateSchema;

	if (customerId) {
		customerId = Number(customerId.trim());
		validateSchema = schemas.queryRentalGET.validate({
			customerId,
		});
	}
	if (gameId) {
		gameId = Number(gameId.trim());
		validateSchema = schemas.queryRentalGET.validate({
			gameId,
		});
	}

	if (validateSchema.error) {
		const message = validateSchema.error.details
			.map((detail) => detail.message)
			.join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	res.locals = validateSchema.value;

	next();
}

export { validateRentalBody, validadeQueryRental };
