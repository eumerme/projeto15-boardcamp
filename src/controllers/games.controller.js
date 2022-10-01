import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createGame(req, res) {
	const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

	try {
		await connection.query(
			`INSERT INTO "games" ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
			[name, image, stockTotal, categoryId, pricePerDay]
		);

		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

async function getGames(req, res) {
	const { name } = res.locals;

	try {
		if (name) {
			const { rows: gamesFiltered } = await connection.query(
				`SELECT * FROM "games" WHERE LOWER (name) LIKE $1;
			`,
				[`%${name}%`]
			);

			if (gamesFiltered.length === 0) {
				return res.sendStatus(STATUS_CODE.NOT_FOUND);
			}

			return res.status(STATUS_CODE.OK).send(gamesFiltered);
		}

		const { rows: games } = await connection.query(`SELECT * FROM "games";`);
		return res.status(STATUS_CODE.OK).send(games);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

export { createGame, getGames };
