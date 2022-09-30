import { connection } from "../database/database.js";
import { MESSAGE } from "../enums/messages.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createRental(req, res) {
	const { customerId, gameId, daysRented } = req.body;
	const rentDate = new Date().toISOString().slice(0, 10);
	const returnDate = null;
	const delayFee = null;

	try {
		const { rows: game } = await connection.query(
			`SELECT * FROM "games" WHERE id = $1;`,
			[gameId]
		);
		const originalPrice = Number(daysRented) * game[0].pricePerDay;

		await connection.query(
			`INSERT INTO "rentals" ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
			[
				customerId,
				gameId,
				rentDate,
				daysRented,
				returnDate,
				originalPrice,
				delayFee,
			]
		);

		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

export { createRental };
