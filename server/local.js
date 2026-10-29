import app from './app.js';
import express from 'express';
import compression from 'compression';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
if(existsSync(dist)){app.use(compression());app.use(express.static(dist));app.get('/{*splat}',(req,res)=>res.sendFile(dist+'index.html'))}
app.listen(process.env.PORT||3001,'127.0.0.1',()=>console.log('HomeFeast listening on port '+(process.env.PORT||3001)));

