import { Router } from "express";
import { validateCustomer } from "../middlewares/customers.middleware.js";
import {
	createCustomer,
	getCustomers,
} from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.post("/customers", validateCustomer, createCustomer);
customersRouter.get("/customers", getCustomers);

export { customersRouter };
