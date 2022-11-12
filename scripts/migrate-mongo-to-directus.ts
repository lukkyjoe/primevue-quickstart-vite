import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";
import throttledQueue from "throttled-queue";
import gql from 'graphql-tag'
import { print } from 'graphql'
import { MyMutation } from './foo.graphql'

// Connection URL
// https://stackoverflow.com/a/52892398/3175120
const url: string = process.env.MONGO_URL as string;
const dbClient = new MongoClient(url);

// Database Name
const dbName = "my-waste"; //TODO: should be my-waste
const throttle = throttledQueue(5, 1000);

const CREATE_UPLOAD_INSTRUCTIONS = gql`
mutation MyMutation ($itemsWithInstructionsInput: [create_waste_items_input!]){
  create_waste_items_items(
    data: $itemsWithInstructionsInput
  ) {
    id
    instructions {
      id
      content
    }
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
  const instructionsArr = await instructionsCollection.find({}).toArray();
  // figure out how to upload an item that 'relates' to an instruction

  const itemsWithInstructions = items.map((item) => {
    const { name } = item
    const instructionObj = instructionsArr.find((instruction) => instruction.item.equals(item._id))
    const instruction = instructionObj?.instruction
    return {
      instructions: {content: instruction},
      name,
      status: "published"
    }
  })

  const confirmation = await uploadBatch(itemsWithInstructions)
  debugger
  // create_waste_items_items
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

const uploadBatch = (itemInstructions: any) => {
  return axios.post('https://kzozb8le.directus.app/graphql', { 
    query: print(CREATE_UPLOAD_INSTRUCTIONS), 
    variables: {itemsWithInstructionsInput: itemInstructions}
  })
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
