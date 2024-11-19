import mongoose from "mongoose";

const MONGO_URL = 'mongodb+srv://elysiumadmin:Nsgv8iaD1S1NvEzi@elysium.2ytlt.mongodb.net/?retryWrites=true&w=majority&appName=Elysium';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error)=> console.log(error));