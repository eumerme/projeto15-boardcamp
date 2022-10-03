import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createGame(req, res) {
	const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

	try {
		await connection.query(
			`INSERT INTO "games"
				("name"
				, "image"
				, "stockTotal"
				, "categoryId"
				, "pricePerDay") 
				VALUES 
					($1, $2, $3, $4, $5);`,
			[name, image, stockTotal, categoryId, pricePerDay]
		);

		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}
}

async function getGames(req, res) {
	const { name } = res.locals;

	try {
		const { rows: games } = await connection.query(
			`SELECT 
				games.*
				, categories.name AS "categoryName" 
				FROM games 
				JOIN categories 
					ON games."categoryId" = categories.id 
				${name ? `WHERE games.name ILIKE $1` : ""};`,
			name ? [`${name}%`] : ""
		);
		if (games.length === 0) {
			return res.sendStatus(STATUS_CODE.NOT_FOUND);
		}

		return res.status(STATUS_CODE.OK).send(games);
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}
}

export { createGame, getGames };
