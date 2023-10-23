import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set(`strictQuery`, true);

  const url = process.env.MONGODB_URL
  if(!url) return console.log(`MONGODB_URL not found`);
  if(isConnected) return console.log(`Already connected to MongoDB`);

  try {
    await mongoose.connect(url);
    isConnected = true;
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.log(error);
  }

}