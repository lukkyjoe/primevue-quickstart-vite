import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";
import throttledQueue from "throttled-queue";
import gql from 'graphql-tag'
import { print } from 'graphql'
// import { MyQuery } from './foo.gql'

// Connection URL
console.log(process.env.MONGO_URL);
// https://stackoverflow.com/a/52892398/3175120
const url: string = process.env.MONGO_URL as string;
const dbClient = new MongoClient(url);

// Database Name
const dbName = "materially-api"; //TODO: should be my-waste
const throttle = throttledQueue(5, 1000);
const GET_WASTE_ITEMS = gql`
query {
  waste_items {
    name
  }
}
`

interface Thing {
  id?: ObjectId;
  name: string;
  admin: boolean;
}

async function migrate(client: MongoClient) {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection<Thing>("things"); //https://github.com/mongodb-developer/mongodb-typescript-example/blob/finish/src/services/database.service.ts#L24
  // get "my-waste.items"
  // also get "my-waste.instructions"

  // the following code examples can be pasted here...
  const things = await collection.find({}).toArray();
  // figure out how to upload an item that 'relates' to an instruction


  // for each item: call api
  return Promise.allSettled(
    things.map((thing) =>
      throttle(() => {
        const { name } = thing;
        return axios.post("https://kzozb8le.directus.app/items/waste_items", {
          name
        });
      })
    )
  );
}

async function run() {
  try {
    const gqlResult = await axios.post('https://kzozb8le.directus.app/graphql', {query: print(GET_WASTE_ITEMS)})
    console.log(gqlResult)
    // console.log(await migrate(dbClient));
  } catch (e) {
    console.error(e);
  } finally {
    dbClient.close();
  }
}

run();
