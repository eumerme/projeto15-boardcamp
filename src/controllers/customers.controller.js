import { connection } from "../database/database.js";
import { MESSAGE } from "../enums/messages.js";
import { STATUS_CODE } from "../enums/statusCode.js";

async function createCustomer(req, res) {
	const { name, phone, cpf, birthday } = req.body;

	try {
		await connection.query(
			`INSERT INTO "customers" ("name", phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
			[name, phone, cpf, birthday]
		);
		return res.sendStatus(STATUS_CODE.CREATED);
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}
}

export { createCustomer };
