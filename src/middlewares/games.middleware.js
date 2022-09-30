import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validadeGame(req, res, next) {
	const { name: title } = req.params;
	const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
	const { value, error } = schemas.gamePOST.validate(
		{
			name,
			image,
			stockTotal,
			categoryId,
			pricePerDay,
			title,
		},
		{ abortEarly: false }
	);

	if (error) {
		const message = error.details.map((detail) => detail.message).join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	try {
		const { rows: games } = await connection.query(
			`SELECT * FROM "games" WHERE "name" = $1;`,
			[name]
		);
		if (games.length !== 0) {
			return res.sendStatus(STATUS_CODE.CONFLICT);
		}
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}

	res.locals.title = value.title;

	next();
}

export { validadeGame };
