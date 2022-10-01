import dayjs from "dayjs";
import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createRental(req, res) {
	const { customerId, gameId, daysRented } = req.body;
	const rentDate = dayjs().format("YYYY-MM-DD");
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

function createRentalBody({ rentals }) {
	const expectedReturnDate = dayjs(rentals.rentDate)
		.add(rentals.daysRented, "days")
		.format("YYYY-MM-DD");
	const returnDate = dayjs();
	const rentDate = dayjs(rentals.rentDate).format("YYYY-MM-DD");
	const daysRented = dayjs(returnDate).diff(rentDate, "day");

	if (daysRented > rentals.daysRented) {
		const delayFee = dayjs(returnDate).diff(expectedReturnDate, "day");
		rentals.delayFee = delayFee * rentals.game.pricePerDay;
	} else {
		rentals.delayFee = 0;
	}
	rentals.returnDate = returnDate;

	return rentals;
}

async function finalizeRental(req, res) {
	const { id } = res.locals;

	try {
		let { rows: rentals } = await connection.query(
			`SELECT 
			rentals.*
			, json_build_object(
				'id', games.id
				, 'stockTotal', games."stockTotal"
				, 'pricePerDay', games."pricePerDay"
			)
				AS game
			FROM rentals
				JOIN games
					ON rentals."gameId" = games.id
			WHERE rentals.id = $1
		;`,
			[id]
		);

		rentals = rentals[0];
		const rentalBody = createRentalBody({ rentals });

		await connection.query(
			`UPDATE	"rentals" 
				SET
					"returnDate" = $1
					, "delayFee" = $2
				WHERE id = $3;`,
			[rentalBody.returnDate, rentalBody.delayFee, rentalBody.id]
		);

		await connection.query(
			`UPDATE "games" SET "stockTotal" = ("stockTotal" + 1) WHERE id = $1;`,
			[rentalBody.game.id]
		);

		return res.sendStatus(STATUS_CODE.OK);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

export { createRental, getRentals, finalizeRental };
