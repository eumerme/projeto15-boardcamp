import { Router } from "express";
import { createGame } from "../controllers/games.controller.js";
import { validadeGame } from "../middlewares/games.middleware.js";

const gamesRouter = Router();

gamesRouter.post("/games", validadeGame, createGame);

export { gamesRouter };
