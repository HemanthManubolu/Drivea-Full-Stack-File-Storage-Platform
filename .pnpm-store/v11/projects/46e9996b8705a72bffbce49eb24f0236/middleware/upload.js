import multer from "multer";

const storage = multer.memoryStorage();

const maxFileSize = process.env.MAX_FILE_SIZE ? Number(process.env.MAX_FILE_SIZE) : 104857600 // 100 MB default

export const upload = multer({
    storage,
    limits: {
        fileSize: maxFileSize
    }
})