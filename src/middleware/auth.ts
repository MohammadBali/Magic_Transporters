import express from "express";
import jwt from "jsonwebtoken";
import constants from '../shared/constants';
import {Worker} from "../models/MagicWorker";

/**Authenticate The User
 * @param req the API's request; so we can extract the header and add fields if needed
 * @param res the API's response; usually if the authentication has failed then we delicate the return from here
 * @param next allow the API to continue into handling if the authentication is a success
 * @return Promise<void> ; no data is returned
 * **/
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