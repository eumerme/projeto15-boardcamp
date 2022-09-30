import { Router } from "express";
import { createRental } from "../controllers/rentals..controller.js";
import { validateRentalBody } from "../middlewares/rentals.middleware.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateRentalBody, createRental);

export { rentalsRouter };
