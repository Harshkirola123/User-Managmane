import express from "express";
import { configEnv } from "./app/common/service/configEnv";
import connectDB from "./app/common/service/databaseConfig";
import route from "./app/routes";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         _id: string;
//         email: string;
//         role?: string;
//       } | null;
//     }
//   }
// }

const app = express();
const Port = process.env.PORT || 5000;
app.use(express.json());

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger_output.json"), "utf8")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function init() {
  configEnv();
  connectDB();
  app.use("/api", route);

  app.listen(Port, () => {
    console.log("Server start at port " + Port);
  });
}
init();
