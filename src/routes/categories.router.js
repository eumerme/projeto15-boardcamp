import { Router } from "express";
import { validadeCategorie } from "../middlewares/categories.middleware.js";
import {
	createCategorie,
	getCategories,
} from "../controllers/categories.controller.js";

const categoriesRouter = Router();

categoriesRouter.post("/categories", validadeCategorie, createCategorie);
categoriesRouter.get("/categories", getCategories);

export { categoriesRouter };
