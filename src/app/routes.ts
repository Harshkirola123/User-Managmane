import { Router } from "express";
import adminRoute from "./admin/admin.route";
import { setPassword } from "./user/setPassword";
import userRoutes from "./user/user.route";
const route = Router();

route.use("/admin", adminRoute);
route.use("/user", userRoutes);
route.patch("/set-password/", setPassword);
export default route;
