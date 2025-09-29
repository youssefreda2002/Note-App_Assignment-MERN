import mongoose from "mongoose";

const MongoURI: any = process.env.MONGO_URI;

console.log(MongoURI);

const MongoDB = async () => {
  await mongoose
    .connect(MongoURI, { dbName: "Note-App" })
    .then(() => console.log("Connected to DB"));
};
export default MongoDB;
