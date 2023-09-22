import { Router } from "express";
import { authAdminOrPrem } from "../middlewares/authSessions/authSessions.js";
import { authUser } from "../middlewares/authSessions/authSessions.js";
import { getUsersHandler } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get("/", getUsersHandler)

export default usersRouter