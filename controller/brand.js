import database from "../database/database.js";


export async function createBrand(name, img) { 
    try{
        const id = await database.instance.createBrand(name, img);
        return id;
    }catch (e){
        throw e;
    }
 }


export async function fetchAllBranch(){
    const result = await database.instance.fetchAllBrand();
    return result;
 }