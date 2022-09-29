import { Router } from "express";
import { categoriesRouter } from "../../../projeto15-boardcamp/src/routes/categories.router.js";

const router = Router();

router.use(categoriesRouter);

export { router };
