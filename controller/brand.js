import database from "../database/database.js";


export async function createBrand(name, img) { 
    try{
        const id = await database.instance.createBrand(name, img);
        return id;
    }catch (e){
        throw e;
    }
 }


export async function fetchAllBrand(){
    const result = await database.instance.fetchAllBrand();
    return result;
 }

 export async function deleteAllBrand(){
     try{
         await database.instance.deleteAllBrand();
     }
     catch (e){
         throw e;
     }
 }

 export async function deleteBrand(id){
     try{
        await database.instance.deleteBrand(id);
     }
     catch (e){
         throw e;
     }
 }


 export async function fetchBrand(id){
    try{
        const result = await database.instance.fetchBrand(id);
        return result;
    }catch (e){
        throw e;
    }
}