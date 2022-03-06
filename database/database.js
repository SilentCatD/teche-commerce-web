import { MongoDBDatabase } from "./scripts/mongo_db_database.js";

MongoDBDatabase
let dbSingleTon;

const database = {
  get instance(){
      if (!dbSingleTon){
          dbSingleTon = new MongoDBDatabase();
      }
      return dbSingleTon;
  }
  
};

export default database;