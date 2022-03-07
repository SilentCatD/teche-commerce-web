import database from '../database/database.js'

async function getImgStream(imgId){
    try{
        let imgStream = await database.instance.fetchImageFileStream(imgId);
        return imgStream;
    }
    catch (e){
        throw e;
    }
  
}

export {getImgStream};