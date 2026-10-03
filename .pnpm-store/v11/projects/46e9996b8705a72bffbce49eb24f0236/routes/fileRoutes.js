import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { getFilePreviewUrl, getFiles, moveFile, permanentDeleteFile, renameFile, restoreFile, softDeleteFile, uploadFiles } from "../controllers/fileController.js";

const fileRouter = express.Router();

// All file routes require authentication
fileRouter.use(protect);

fileRouter.post("/upload", upload.array("files", 10), uploadFiles)
fileRouter.get("/", getFiles)
fileRouter.get("/:id/preview", getFilePreviewUrl)
fileRouter.patch("/:id/rename", renameFile)
fileRouter.patch("/:id/move", moveFile)
fileRouter.delete("/:id", softDeleteFile)
fileRouter.post("/:id/restore", restoreFile)
fileRouter.delete("/:id/permanent", permanentDeleteFile)

export default fileRouter;
