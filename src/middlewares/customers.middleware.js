import { connection } from "../database/database.js";
import { STATUS_CODE } from "../enums/statusCode.js";
import { schemas } from "../schemas/schemas.js";

async function validateCustomerBody(req, res, next) {
	const { name, phone, cpf, birthday } = req.body;

	const { error } = schemas.customerPOST.validate({
		name,
		phone,
		cpf,
		birthday,
	});
	if (error) {
		const message = error.details.map((detail) => detail.message).join(",");
		return res.status(STATUS_CODE.BAD_REQUEST).send({ message });
	}

	next();
}

async function validateCustomerCpf(req, res, next) {
	const { cpf } = req.body;

	try {
		const { rows: customer } = await connection.query(
			`SELECT * FROM "customers" WHERE cpf = $1;`,
			[cpf]
		);
		if (customer.length !== 0) {
			return res.sendStatus(STATUS_CODE.CONFLICT);
		}
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}

	next();
}

async function validateCustomerId(req, res, next) {
	const { id } = req.params;

	try {
		const { rows: customerById } = await connection.query(
			`SELECT * FROM "customers" WHERE id = $1;`,
			[id]
		);
		if (customerById.length === 0) {
			return res.sendStatus(STATUS_CODE.NOT_FOUND);
		}
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}

	next();
}

async function validateCpfOwner(req, res, next) {
	const { cpf } = req.body;
	const { id } = req.params;

	try {
		const { rows: customer } = await connection.query(
			`SELECT * FROM "customers" WHERE id = $1;`,
			[id]
		);
		if (customer.length === 0) {
			return res.sendStatus(STATUS_CODE.NOT_FOUND);
		}
		if (cpf !== customer[0].cpf) {
			const { rows: cpfExists } = await connection.query(
				`SELECT * FROM "customers" WHERE cpf = $1;`,
				[cpf]
			);
			if (cpfExists.length !== 0) {
				return res.sendStatus(STATUS_CODE.CONFLICT);
			}
		}
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}

	next();
}

export {
	validateCustomerBody,
	validateCustomerCpf,
	validateCustomerId,
	validateCpfOwner,
};
