import mongoose from "mongoose";

const MONGO_URL = 'mongodb+srv://elysiumadmin:Nsgv8iaD1S1NvEzi@elysium.2ytlt.mongodb.net/?retryWrites=true&w=majority&appName=Elysium';

mongoose.Promise = Promise;

const initDB = async ()=> {
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Conectado a la DB.")}
        catch(error:any){
            console.log("Error al conectar la db", error.message)
        }
    }

export default initDB ;
