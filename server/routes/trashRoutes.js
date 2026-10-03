import express from "express";
import { protect } from "../middleware/auth.js";
import { emptyTrash, getTrashItems } from "../controllers/trashController.js";

const trashRouter = express.Router()

trashRouter.use(protect);

trashRouter.get("/", getTrashItems)
trashRouter.post("/empty", emptyTrash)

export default trashRouter