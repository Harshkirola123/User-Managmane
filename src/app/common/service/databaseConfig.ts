import mongoose from "mongoose";

const connectDB = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    const uri = process.env.MONGO_URI || "";
    if (uri == "") throw new Error("URI is not valid");
    mongoose
      .connect(uri)
      .then(() => {
        console.log("Database connect.");
        resolve(true);
      })
      .catch(reject);
  });
};
export default connectDB;
