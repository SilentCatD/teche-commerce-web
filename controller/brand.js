import database from "../database/database.js";


export async function createBrand(name, img) { 
    try{
        let id = await database.instance.createBrand(name, img);
        return id;
    }catch (e){
        throw e;
    }
 }