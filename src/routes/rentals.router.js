import { Router } from "express";
import { createRental, getRentals } from "../controllers/rentals.controller.js";
import {
	validadeQueryRental,
	validateRentalBody,
} from "../middlewares/rentals.middleware.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateRentalBody, createRental);
rentalsRouter.get("/rentals", validadeQueryRental, getRentals);

export { rentalsRouter };
