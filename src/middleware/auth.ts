import express from "express";
import jwt from "jsonwebtoken";
import constants from '../shared/constants';
import {Worker} from "../models/MagicWorker";

/**Authenticate The User **/
const userAuth=async(req:express.Request, res:express.Response, next: express.NextFunction) =>
{
    try
    {
        const token= req.header('Authorization')?.replace('Bearer ','');

        const data:any= jwt.verify(token as string ,constants.SignKey);

        const user= await Worker.findOne({_id:data._id, 'tokens.token':token }); //Find a worker with his ID and with this Token, if found => Authenticated

        if(!user)
        {
            throw new Error();
        }

        // @ts-ignore
        req.token=token;
        // @ts-ignore
        req.user=user;

        next();
    }

    catch(e:any)
    {
        res.status(401).send({error:'Not Authenticated', message:e.message});
    }
};

export default {userAuth};