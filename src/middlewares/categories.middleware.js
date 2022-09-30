import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validadeCategory(req, res, next) {
	const { name } = req.body;
	const { error } = schemas.categoryPOST.validate({ name });

	if (error) {
		const message = error.details.map((detail) => detail.message).join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	try {
		const { rows: categories } = await connection.query(
			`SELECT * FROM "categories" WHERE name = $1;`,
			[name]
		);
		if (categories.length !== 0) {
			return res.sendStatus(STATUS_CODE.CONFLICT);
		}
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}

	next();
}

export { validadeCategory };
