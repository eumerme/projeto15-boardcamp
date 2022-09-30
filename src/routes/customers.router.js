import { Router } from "express";
import {
	validateCustomerBody,
	validateCustomerId,
} from "../middlewares/customers.middleware.js";
import {
	createCustomer,
	getCustomers,
	getCustomerById,
} from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.post("/customers", validateCustomerBody, createCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);

export { customersRouter };
