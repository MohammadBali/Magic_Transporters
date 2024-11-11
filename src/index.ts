import express from "express";
import dbConnect from "./db/mongoose";

import workerRouter from './routers/MagicWorker';
import itemRouter from './routers/MagicItem';
import missionRouter from './routers/MagicMission';
import {setupSwagger} from "./swagger";

const app = express();
const port = process.env.PORT || 3000;

// Use JSON middleware
app.use(express.json());

//Set up Swagger
setupSwagger(app);

//API Handler of Worker Endpoints
app.use(workerRouter);
app.use(itemRouter);
app.use(missionRouter);


//Connect To Database
dbConnect();

//Expose Web Server
app.listen(port,()=>
{
    console.log(`Web Server Listening on port: ${port}`);
});
