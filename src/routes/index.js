import { Router } from "express";
import { categoriesRouter } from "./categories.router.js";
import { gamesRouter } from "./games.router.js";
import { customersRouter } from "./customers.router.js";
import { rentalsRouter } from "./rentals.router.js";

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export { router };
