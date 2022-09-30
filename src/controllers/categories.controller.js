import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createCategory(req, res) {
	const { name } = req.body;

	try {
		await connection.query(`INSERT INTO "categories" ("name") VALUES ($1);`, [
			name,
		]);
		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

async function getCategories(req, res) {
	try {
		const { rows: categories } = await connection.query(
			`SELECT * FROM "categories";`
		);
		return res.status(STATUS_CODE.OK).send(categories);
	} catch (error) {
		console.log(error);
		return res.sendStatus(STATUS_CODE.SERVER_ERROR);
	}
}

export { createCategory, getCategories };
