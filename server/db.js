import 'dotenv/config';
import { MongoClient } from 'mongodb';
let promise;
export async function db(){if(!process.env.MONGO_URI) throw new Error('MONGO_URI is required');if(!promise) promise=new MongoClient(process.env.MONGO_URI,{serverSelectionTimeoutMS:8000}).connect().catch(e=>{promise=undefined;throw e});return (await promise).db('HomeFeast');}
export async function closeDb(){if(promise){await(await promise).close();promise=undefined}}
