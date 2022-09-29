import { Router } from "express";
import { categoriesRouter } from "./categories.router.js";
import { gamesRouter } from "./games.router.js";

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);

export { router };
