import { Router } from "express";
import { createGame, getGames } from "../controllers/games.controller.js";
import {
	validadeGame,
	validadeQueryGame,
} from "../middlewares/games.middleware.js";

const gamesRouter = Router();

gamesRouter.post("/games", validadeGame, createGame);
gamesRouter.get("/games", validadeQueryGame, getGames);

export { gamesRouter };
