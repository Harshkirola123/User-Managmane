import express from "express";
import { configEnv } from "./app/common/service/configEnv";
import connectDB from "./app/common/service/databaseConfig";
import route from "./app/routes";

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
function init() {
  configEnv();
  connectDB();
  app.use("/api", route);

  app.listen(Port, () => {
    console.log("Server start at port " + Port);
  });
}
init();
