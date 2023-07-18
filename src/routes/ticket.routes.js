import { Router } from "express";
import { createTicketHandler } from "../controllers/ticket.controller.js";


const ticketRouter = Router()

//Creo ticket mediante método POST
ticketRouter.post("/", createTicketHandler)

export default ticketRouter