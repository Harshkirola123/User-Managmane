// utils/multerConfig.ts
import multer from "multer";
import path from "path";

// Define where to store uploaded KYC images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/kyc_photos"); // KYC photo upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Store files with unique names
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and JPEG are allowed"),
      false
    );
  }
};

export const uploadKYC = multer({ storage, fileFilter });
