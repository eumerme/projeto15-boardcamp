import { connection } from "../database/database.js";
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

		await connection.query(
			`UPDATE "games" SET "stockTotal" = ("stockTotal" - 1) WHERE id = $1;`,
			[gameId]
		);

		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

async function getRentals(req, res) {
	const { customerId, gameId } = res.locals;
	let type, id;

	try {
		if (customerId) {
			type = "customerId";
			id = customerId;
		}
		if (gameId) {
			type = "gameId";
			id = gameId;
		}
		if (id) {
			const { rows: rentalsById } = await connection.query(
				`
				SELECT 
					rentals.*
					, json_build_object(
						'id', customers.id
						, 'name', customers.name
					) 
						AS customer
					, json_build_object(
						'id', games.id
						, 'name', games.name
						, 'categoryId', games."categoryId"
						, 'categoryName', categories.name
					)
						AS game
					FROM rentals
						JOIN customers
							ON rentals."customerId" = customers.id
						JOIN games
							ON rentals."gameId" = games.id
						JOIN categories
							ON games."categoryId" = categories.id
					WHERE rentals."${type}" = $1
				;`,
				[id]
			);
			return res.status(STATUS_CODE.OK).send(rentalsById);
		}

		const { rows: rentals } = await connection.query(`
			SELECT 
				rentals.*
				, json_build_object(
					'id', customers.id
					, 'name', customers.name
				) 
					AS customer
				, json_build_object(
					'id', games.id
					, 'name', games.name
					, 'categoryId', games."categoryId"
					, 'categoryName', categories.name
				)
					AS game
				FROM rentals
					JOIN customers
						ON rentals."customerId" = customers.id
					JOIN games
						ON rentals."gameId" = games.id
					JOIN categories
						ON games."categoryId" = categories.id
		;`);
		return res.status(STATUS_CODE.OK).send(rentals);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

export { createRental, getRentals };
