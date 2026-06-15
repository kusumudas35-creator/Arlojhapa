import express from "express";
import path from "path";
import { z } from "zod";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary (it will automatically use the environment variables if available)
// Or we can explicitly configure it:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist/uploads" : "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Explicit, robust serving of /uploads for uploaded media with CORS and byte-range controls (important for Safari/iOS)
  app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
      res.setHeader("Accept-Ranges", "bytes");
    }
  }));

  const isCloudinaryConfigured = () => {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== "your_api_secret"
    );
  };

  // Base64 Media Upload API route
  app.post("/api/upload-media-base64", async (req, res) => {
    try {
      const { fileData, fileName, fileType } = req.body;
      
      if (!fileData) {
        return res.status(400).json({ error: "No media file provided" });
      }

      const isVideo = fileType?.startsWith("video/");

      // If Cloudinary is configured, use it as primary
      if (isCloudinaryConfigured()) {
        console.log("Uploading base64 file to Cloudinary...");
        const result = await cloudinary.uploader.upload(fileData, {
          resource_type: "auto",
        });
        return res.json({
          url: result.secure_url,
          type: result.resource_type === "video" ? "video" : "image"
        });
      }

      console.log("Cloudinary not configured. Falling back to local storage.");

      // Extract the base64 string from data URL (e.g. "data:image/png;base64,iVBORw0KGgo...")
      let base64String = fileData;
      if (fileData.includes(",")) {
        base64String = fileData.split(",")[1];
      }

      if (!base64String) {
        return res.status(400).json({ error: "Invalid base64 format" });
      }

      const buffer = Buffer.from(base64String, "base64");
      
      let ext = path.extname(fileName || "");
      if (!ext) {
        ext = isVideo ? ".mp4" : ".png";
      }
      
      const newFilename = `upload_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, newFilename);

      // Write to disk
      fs.writeFileSync(filePath, buffer);

      // Return public URL
      const fileUrl = `/uploads/${newFilename}`;
      res.json({ url: fileUrl, type: isVideo ? "video" : "image" });
    } catch (error: any) {
      console.error("Base64 upload error:", error);
      res.status(500).json({ error: "Failed to upload media", details: error.message });
    }
  });

  // Legacy Media Upload API route (for multipart)
  app.post("/api/upload-media", (req, res, next) => {
    upload.single("media")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload error", details: err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No media file provided" });
      }

      const isVideo = req.file.mimetype.startsWith("video/");

      // If Cloudinary is configured, use it as primary
      if (isCloudinaryConfigured()) {
        console.log("Uploading buffer file to Cloudinary...");
        const base64Str = req.file.buffer.toString("base64");
        const fileUri = `data:${req.file.mimetype};base64,${base64Str}`;
        const result = await cloudinary.uploader.upload(fileUri, {
          resource_type: "auto",
        });
        return res.json({
          url: result.secure_url,
          type: result.resource_type === "video" ? "video" : "image"
        });
      }

      console.log("Cloudinary not configured. Falling back to local storage.");

      // Generate a unique filename using timestamp and original name
      let ext = path.extname(req.file.originalname);
      if (!ext) {
        ext = isVideo ? ".mp4" : ".png";
      }
      const filename = `upload_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      // Write the file buffer to disk
      fs.writeFileSync(filePath, req.file.buffer);

      // Return the public URL
      const fileUrl = `/uploads/${filename}`;

      res.json({ url: fileUrl, type: isVideo ? "video" : "image" });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload media", details: error.message });
    }
  });

  // Catch all unhandled API routes BEFORE Vite middleware!
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Global Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Funhub Backend running on http://localhost:${PORT}`);
  });
}

startServer();
