import { Router } from "express";
import { authAdminOrPrem } from "../middlewares/authSessions/authSessions.js";
import { deleteUsersHandler, getUsersHandler } from "../controllers/users.controller.js";

const usersRouter = Router()

usersRouter.get("/", authAdminOrPrem, getUsersHandler)

usersRouter.delete("/:id", authAdminOrPrem, deleteUsersHandler)

export default usersRouter