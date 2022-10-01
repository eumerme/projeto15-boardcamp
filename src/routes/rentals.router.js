import { Router } from "express";
import {
	createRental,
	deleteRental,
	finalizeRental,
	getRentals,
} from "../controllers/rentals.controller.js";
import {
	validadeQueryRental,
	validadeRental,
	validateRentalBody,
} from "../middlewares/rentals.middleware.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateRentalBody, createRental);
rentalsRouter.get("/rentals", validadeQueryRental, getRentals);
rentalsRouter.post("/rentals/:id/return", validadeRental, finalizeRental);
rentalsRouter.delete("/rentals/:id", validadeRental, deleteRental);

export { rentalsRouter };
