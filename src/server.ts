import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();
const port: number = 5000;

const main = async () => {
  try {
    // connecting to mongodb using mongoose
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@cluster0.cu6ru.mongodb.net/LibraryDB?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB using Mongoose");

    // listening the server on post 5000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
