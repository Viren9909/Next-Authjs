import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            console.log("Already connected to database.");
            return
        }
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database.");
        return db;
    } catch (error) {
        console.log(error);
        console.log("Error while connecting with databse.");
        process.exit(1);
    }
}

export default connectDB;