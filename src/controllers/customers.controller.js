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

async function getCustomers(req, res) {
	const { cpf } = req.query;

	try {
		if (cpf) {
			const { rows: customersFiltered } = await connection.query(
				`SELECT * FROM "customers" WHERE (cpf) LIKE $1;`,
				[`${cpf}%`]
			);
			return res.status(STATUS_CODE.OK).send(customersFiltered);
		}

		const { rows: customers } = await connection.query(
			`SELECT * FROM "customers";`
		);
		return res.status(STATUS_CODE.OK).send(customers);
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}
}

async function getCustomerById(req, res) {
	const { id } = req.params;

	try {
		const { rows: customer } = await connection.query(
			`SELECT * FROM "customers" WHERE id = $1;
        `,
			[id]
		);
		return res.status(STATUS_CODE.OK).send(customer[0]);
	} catch (error) {
		return res
			.status(STATUS_CODE.SERVER_ERROR)
			.send({ message: MESSAGE.SERVER_ERROR });
	}
}

export { createCustomer, getCustomers, getCustomerById };
