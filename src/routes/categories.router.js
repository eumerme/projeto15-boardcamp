import { Router } from "express";
import { createCategories } from "../controllers/categories.controller.js";
import { validadeCategorie } from "../middlewares/categories.middleware.js";

const categoriesRouter = Router();

categoriesRouter.post("/categories", validadeCategorie, createCategories);

export { categoriesRouter };
