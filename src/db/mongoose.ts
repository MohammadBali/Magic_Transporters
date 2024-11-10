import mongoose from "mongoose";
import dotenv from 'dotenv';

/**Initialize the environment variables **/
dotenv.config();

console.log('Connecting to DB...');

/**
 * Connect to MongoDB using Mongoose Driver
 * @returns Void and prints if connected
 * @throws Null Prints the error reason
 * **/
const dbConnect = ()=>
{
    mongoose.connect(process.env.MONGODB_URI as string, {autoIndex:true}).then((value)=>
    {
        console.log('Connected to DB Successfully...');
    }).catch((error)=>
    {
        console.log(`FAILED TO CONNECT TO DB..., ${error.message}`);
    });
};

export default dbConnect;