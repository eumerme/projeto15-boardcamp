import { Router } from "express";
import {
	createCategories,
	getCategories,
} from "../controllers/categories.controller.js";
import { validadeCategorie } from "../middlewares/categories.middleware.js";

const categoriesRouter = Router();

categoriesRouter.post("/categories", validadeCategorie, createCategories);
categoriesRouter.get("/categories", getCategories);

export { categoriesRouter };
