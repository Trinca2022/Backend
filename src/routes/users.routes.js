import { Router } from "express";
import { authAdminOrPrem } from "../middlewares/authSessions/authSessions.js";
import { getUsersHandler } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get("/", authAdminOrPrem, getUsersHandler)

export default usersRouter