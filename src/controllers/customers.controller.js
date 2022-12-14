import { connection } from "../database/database.js";
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
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}
}

async function getCustomers(req, res) {
	const { cpf } = req.query;

	try {
		const { rows: customers } = await connection.query(
			`SELECT * FROM customers ${cpf ? `WHERE (cpf) LIKE $1` : ""};`,
			cpf ? [`${cpf}%`] : ""
		);
		if (customers.length === 0) {
			return res.sendStatus(STATUS_CODE.NOT_FOUND);
		}
		return res.status(STATUS_CODE.OK).send(customers);
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
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
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}
}

async function updateCustomer(req, res) {
	const { id } = req.params;
	const { name, phone, cpf, birthday } = req.body;

	try {
		await connection.query(
			`UPDATE "customers" 
				SET "name" = $1, "phone" = $2, "cpf" = $3, "birthday" = $4 WHERE id = $5;`,
			[name, phone, cpf, birthday, id]
		);
		return res.sendStatus(STATUS_CODE.OK);
	} catch (error) {
		return res.status(STATUS_CODE.SERVER_ERROR).send(error);
	}
}

export { createCustomer, getCustomers, getCustomerById, updateCustomer };
