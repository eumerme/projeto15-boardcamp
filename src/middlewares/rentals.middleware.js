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
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}

	next();
}

async function validadeQueryRental(req, res, next) {
	let { customerId, gameId } = req.query;
	let validateSchema;

	if (customerId) {
		customerId = customerId.trim();
		validateSchema = schemas.queryRentalGET.validate({
			customerId,
		});
	}

	if (gameId) {
		gameId = gameId.trim();
		validateSchema = schemas.queryRentalGET.validate({
			gameId,
		});
	}

	if (validateSchema?.error) {
		const message = validateSchema.error.details
			.map((detail) => detail.message)
			.join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	res.locals.customerId = validateSchema?.value.customerId;
	res.locals.gameId = validateSchema?.value.gameId;

	next();
}

async function validadeRental(req, res, next) {
	const { path } = req.route;
	let { id } = req.params;
	id = id.trim();

	const { value, error } = schemas.paramsId.validate({
		id,
	});
	if (error) {
		const message = error.details.map((detail) => detail.message).join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	try {
		const { rows: rental } = await connection.query(
			`SELECT * FROM "rentals" WHERE id = $1;`,
			[id]
		);
		if (rental.length === 0) {
			return res.sendStatus(STATUS_CODE.NOT_FOUND);
		}

		const invalidRentalReq =
			(rental[0].returnDate && path === "/rentals/:id/return") ||
			(!rental[0].returnDate && path === "/rentals/:id");
		if (invalidRentalReq) {
			return res.sendStatus(STATUS_CODE.BAD_REQUEST);
		}
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}

	res.locals.id = value.id;

	next();
}

export { validateRentalBody, validadeQueryRental, validadeRental };
