import { Router } from "express";
import { validadeCategory } from "../middlewares/categories.middleware.js";
import {
	createCategory,
	getCategories,
} from "../controllers/categories.controller.js";

const categoriesRouter = Router();

categoriesRouter.post("/categories", validadeCategory, createCategory);
categoriesRouter.get("/categories", getCategories);

export { categoriesRouter };
