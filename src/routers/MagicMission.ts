import express, {Request, Response} from 'express';

import {Worker} from "../models/MagicWorker";
import {Mission} from "../models/MagicMission";
import {Item} from "../models/MagicItem";
import auth from "../middleware/auth";

const router = express.Router();

//Get All Missions in the system
//Todo: Should be Paginated...
/**
 * @swagger
 * /mission/all:
 *   get:
 *     summary: Retrieve a paginated list of all missions in the system.
 *     tags:
 *       - Mission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of missions per page (default is 10).
 *     responses:
 *       200:
 *         description: A paginated list of missions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       worker:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             itemId:
 *                               type: string
 *                             quantity:
 *                               type: integer
 *                       state:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error while retrieving missions.
 */
router.get('/mission/all' ,async (req: Request, res: Response):Promise<any> => {

    try
    {
        const missions = await Mission.find().populate('worker').populate('items.itemId');

        return res.status(200).send({missions:missions});
    }
    catch (e:any)
    {
        return res.status(500).send({error:"An error occurred while getting all missions", message:e.message});
    }
});

//Get A Specific Mission Information
/**
 * @swagger
 * /mission/details/{id}:
 *   get:
 *     summary: Get details of a specific mission by its ID.
 *     tags:
 *       - Mission
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the mission to retrieve.
 *     responses:
 *       200:
 *         description: Details of the specified mission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 worker:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                 state:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Mission not found.
 *       500:
 *         description: Server error while retrieving mission details.
 */
router.get('/mission/details/:id',async (req: Request, res: Response):Promise<any> => {
    try
    {
        const mission = await Mission.findById(req.params.id).populate('worker').populate('items.itemId');

        if(!mission)
        {
            return res.status(404).send({error:'No Such Mission with Such ID'});
        }

        return res.status(200).send(mission);
    }
    catch (e:any)
    {
        return res.status(500).send({error:'Error While Getting This mission details...', message:e.message});
    }
});

//Create new mission
/**
 * @swagger
 * /mission/add:
 *   post:
 *     summary: Create a new mission.
 *     tags:
 *       - Mission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               worker:
 *                 type: string
 *                 description: The ID of the worker assigned to the mission.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       description: The ID of the item for the mission.
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the item to load for the mission.
 *               state:
 *                 type: string
 *                 default: "in_progress"
 *     responses:
 *       201:
 *         description: Mission successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     worker:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                     state:
 *                       type: string
 *       400:
 *         description: Mission could not be created.
 *       500:
 *         description: Server error while creating mission.
 */
router.post('/mission/add', async(req: Request, res: Response):Promise<any> => {
    try
    {
        const mission = new Mission(req.body);

        await mission.save();

        if(!mission)
        {
            return res.status(400).send({error:'Mission could not be created'});
        }

        const worker = await Worker.findOneAndUpdate({_id:mission.worker}, {$set: {state:'onMission'}});

        //Populating Fields
        await mission.populate('worker');
        await mission.populate('items.itemId');

        return res.status(201).send({mission:mission});
    }
    catch (e:any)
    {
        return res.status(500).send({error:'Error While Adding new mission...', message:e.message});
    }
});

//Load a New Item to the Mission
/**
 * @swagger
 * /mission/loadItem:
 *   patch:
 *     summary: Load a new item into an existing mission.
 *     tags:
 *       - Mission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               missionId:
 *                 type: string
 *                 description: The ID of the mission to update.
 *               itemId:
 *                 type: string
 *                 description: The ID of the item to load into the mission.
 *     responses:
 *       200:
 *         description: Item successfully loaded into the mission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     worker:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                     state:
 *                       type: string
 *       400:
 *         description: Mission ID and Item ID are required or weight limit exceeded.
 *       404:
 *         description: Mission or Item not found.
 *       500:
 *         description: Server error while loading item into mission.
 */
router.patch('/mission/loadItem', async(req: Request, res: Response):Promise<any> => {
    try
    {
        const missionId = req.body.missionId;
        const itemId = req.body.itemId;

        if (!missionId || !itemId) {
            return res.status(400).send({ error: 'Mission ID and Item ID are required' });
        }

        // Fetch the item details to get its weight
        const item = await Item.findById(itemId);
        if (!item)
        {
            return res.status(404).send({ error: 'Item not found', message: 'The specified item does not exist' });
        }

        // Find the mission and populate worker and items
        const mission = await Mission.findById(missionId).populate('worker').populate('items.itemId');
        if (!mission) {
            return res.status(404).send({ error: 'Mission not found', message: 'Could not find a mission with the provided ID' });
        }

        // Calculate current weight of items in mission
        const currentWeight = mission.items.reduce((total, missionItem) => {
            const missionItemWeight = missionItem.itemId ? missionItem.itemId.weight : 0;
            return total + missionItemWeight;
        }, 0);

        // Check if adding the new item would exceed the worker's weight limit
        const worker = mission.worker;
        if (worker && currentWeight + item.weight > worker.weightLimit) {
            return res.status(400).send({
                error: 'Weight limit exceeded',
                message: `Adding this item would exceed the worker's weight limit of ${worker.weightLimit} units`
            });
        }

        //Update the Worker State
        const updatedWorker = await Worker.findOneAndUpdate({_id:mission.worker._id}, {$set: {state:'loading'}}, {new:true});

        if(!updatedWorker)
        {
            return res.status(404).send({error:'Error While loading Items', message:'Could not update worker'});
        }

        //Update The Mission Items
        const updatedMission = await Mission.findOneAndUpdate({_id: missionId}, { $push: { items: { itemId } } }, {new:true})
            .populate('worker').populate('items.itemId');

        if(!updatedMission)
        {
            return res.status(404).send({error:'Error While loading Items', message:'Could not find such mission with such ID'});
        }

        return res.status(200).send({mission:updatedMission});

    }
    catch (e:any)
    {
        return res.status(500).send({error:'Could not load Item...', message:e.message});
    }
});

//End Mission
/**
 * @swagger
 * /mission/endMission:
 *   patch:
 *     summary: End a specific mission and update its state to "finished".
 *     tags:
 *       - Mission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               missionId:
 *                 type: string
 *                 description: The ID of the mission to end.
 *     responses:
 *       200:
 *         description: Mission successfully ended.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     worker:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemId:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                     state:
 *                       type: string
 *       404:
 *         description: Mission not found.
 *       500:
 *         description: Server error while ending mission.
 */
router.patch('/mission/endMission', async(req: Request, res: Response):Promise<any> => {
    try
    {
        const missionId = req.body.missionId;

        const updatedMission = await Mission.findOneAndUpdate({_id: missionId}, {$set:{state:'finished'}}, {new:true})
            .populate('worker').populate('items.itemId');

        if(!updatedMission)
        {
            return res.status(404).send({error:'Error While finishing mission', message:'Could not find such mission with such ID'});
        }

        const updatedWorker = await Worker.findOneAndUpdate({_id:updatedMission.worker._id}, {$set: {state:'resting'}}, {new:true});

        if(!updatedWorker)
        {
            return res.status(404).send({error:'Error While loading Items', message:'Could not update worker'});
        }

        updatedMission.worker=updatedWorker;

        return res.status(200).send({mission:updatedMission});

    }
    catch (e:any)
    {
        return res.status(500).send({error:'Could not load Item...', message:e.message});
    }
});


export default router;