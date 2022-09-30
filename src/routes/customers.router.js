import { Router } from "express";
import { createCustomer } from "../controllers/customers.controller.js";
import { validateCustomer } from "../middlewares/customers.middleware.js";

const customersRouter = Router();

customersRouter.post("/customers", validateCustomer, createCustomer);

export { customersRouter };
