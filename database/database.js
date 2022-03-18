import Database from "./scripts/database_service.js";

Database
let dbSingleTon;

const database = {
  get instance(){
      if (!dbSingleTon){
          dbSingleTon = new Database();
      }
      return dbSingleTon;
  }
  
};

export default database;