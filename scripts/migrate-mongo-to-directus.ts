import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";

// Connection URL
console.log(process.env.MONGO_URL);
// https://stackoverflow.com/a/52892398/3175120
const url: string = process.env.MONGO_URL as string;
const client = new MongoClient(url);

// Database Name
const dbName = "materially-api";

interface Thing {
  id?: ObjectId;
  name: string;
  admin: boolean;
}

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection<Thing>("things"); //https://github.com/mongodb-developer/mongodb-typescript-example/blob/finish/src/services/database.service.ts#L24

  // the following code examples can be pasted here...
  const things = await collection.find({}).toArray();

  // for each item: call api
  return Promise.allSettled(
    things.map((thing) => {
      axios.post();
    })
  );
}

async function run() {
  try {
    await main();
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

run();
