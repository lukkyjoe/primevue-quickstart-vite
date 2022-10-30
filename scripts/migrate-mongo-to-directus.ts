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
const dbName = "my-waste"; //TODO: should be my-waste
const throttle = throttledQueue(5, 1000);
const GET_WASTE_ITEMS = gql`
query {
  waste_items {
    name
  }
}
`

interface Thing {
  _id?: ObjectId;
  name: string;
}

interface Instruction {
  _id: ObjectId;
  item: ObjectId;
  location: string;
  instruction?: string;
}

async function migrate(client: MongoClient) {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const itemsCollection = db.collection<Thing>("items"); //https://github.com/mongodb-developer/mongodb-typescript-example/blob/finish/src/services/database.service.ts#L24
  const instructionsCollection = db.collection<Instruction>("instructions")
  // get "my-waste.items"
  // also get "my-waste.instructions"

  // the following code examples can be pasted here...
  const items = await itemsCollection.find({}).toArray();
  const instructions = await instructionsCollection.find({}).toArray();
  // figure out how to upload an item that 'relates' to an instruction
  
  const itemsWithInstructions = items.map((item) => {
    const instruction = instructions.find((instruction) => instruction.item.equals(item._id) )
    return { 
      instruction,
      ...item }
    })
  debugger
    

  // upload the thing up


  // for each item: call api
  // return Promise.allSettled(
  //   items.map((thing) =>
  //     throttle(() => {
  //       const { name } = thing;
  //       return axios.post("https://kzozb8le.directus.app/items/waste_items", {
  //         name
  //       });
  //     })
  //   )
  // );
}

async function run() {
  try {
    // const gqlResult = await axios.post('https://kzozb8le.directus.app/graphql', {query: print(GET_WASTE_ITEMS)})
    // console.log(gqlResult)
    console.log(await migrate(dbClient));
  } catch (e) {
    console.error(e);
  } finally {
    dbClient.close();
  }
}

run();
