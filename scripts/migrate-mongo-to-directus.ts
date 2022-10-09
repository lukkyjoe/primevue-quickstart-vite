import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

// Connection URL
console.log(process.env.MONGO_URL);
// https://stackoverflow.com/a/52892398/3175120
const url: string = process.env.MONGO_URL as string;
const client = new MongoClient(url);

// Database Name
const dbName = "materially-api";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("things");

  // the following code examples can be pasted here...
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  // for each item: call api

  return findResult;
}

async function run() {
  try {
    const result = await main();
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

run();
