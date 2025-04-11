import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { fileURLToPath } from 'url';

// Get the directory name in a Node.js ESM compatible way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// This function is not used in production
export async function setupVite(_app: Express, _server: Server) {
  throw new Error("setupVite should not be called in production");
}

export function serveStatic(app: Express) {
  // Try different potential static file paths
  const possiblePaths = [
    path.resolve(__dirname, "../client/dist"),
    path.resolve(__dirname, "../dist"),
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "../server/public"),
    path.resolve(__dirname, "../public")
  ];
  
  // Find the first path that exists
  let staticPath = null;
  for (const pathToCheck of possiblePaths) {
    if (fs.existsSync(pathToCheck)) {
      staticPath = pathToCheck;
      break;
    }
  }
  
  if (!staticPath) {
    console.warn("No static files found. Creating empty directory.");
    staticPath = path.resolve(__dirname, "public");
    try {
      fs.mkdirSync(staticPath, { recursive: true });
    } catch (err) {
      console.error("Failed to create public directory:", err);
    }
  }
  
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
  
  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Application is being built. Please try again later.");
    }
  });
}