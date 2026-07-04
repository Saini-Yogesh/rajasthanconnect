import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support loading .env from the backend directory or from the root directory relative to this file
dotenv.config({ path: path.resolve(__dirname, ".env") });
