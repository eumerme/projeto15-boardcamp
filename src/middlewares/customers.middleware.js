import { connection } from "../database/database.js";
import { MESSAGE } from "../enums/messages.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validateCustomer(req, res, next) {
	const { name, phone, cpf, birthday } = req.body;

	const { error } = schemas.customerPOST.validate({
		name,
		phone,
		cpf,
		birthday,
	});

	if (error) {
		const message = error.details
			.map((detail) => detail.message)
			.join(",")
			.replace("/^\\d{4}-\\d{2}-\\d{2}$/", "YYYY-MM-DD");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	try {
		const { rows: customers } = await connection.query(
			`SELECT * FROM "customers" WHERE cpf = $1;
        `,
			[cpf]
		);
		if (customers.length !== 0) {
			return res.sendStatus(STATUS_CODE.CONFLICT);
		}
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}

	next();
}

export { validateCustomer };
