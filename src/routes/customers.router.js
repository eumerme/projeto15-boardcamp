import { Router } from "express";
import {
	validateCustomerBody,
	validateCustomerCpf,
	validateCustomerId,
} from "../middlewares/customers.middleware.js";
import {
	createCustomer,
	getCustomers,
	getCustomerById,
	updateCustomer,
} from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.post(
	"/customers",
	validateCustomerBody,
	validateCustomerCpf,
	createCustomer
);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customersRouter.put("/customers/:id", validateCustomerBody, updateCustomer);

export { customersRouter };
