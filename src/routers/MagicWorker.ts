import express, {Request, Response} from 'express';
import auth from "../middleware/auth";
import {Worker} from "../models/MagicWorker";
import {Item} from "../models/MagicItem";
import {Mission} from "../models/MagicMission";

const router = express.Router();

//Get All Workers in The System
/**
 * @swagger
 * /worker/all:
 *   get:
 *     summary: Retrieve a list of all workers in the system.
 *     tags:
 *       - Worker
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all workers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allWorkers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       weightLimit:
 *                         type: number
 *                       state:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error while retrieving workers.
 */
router.get('/worker/all', auth.userAuth, async (req: Request, res: Response):Promise<any>=> {

    try
    {
        const w = await Worker.find();

        return res.status(200).send({allWorkers:w});
    }

    catch (e: any)
    {
        return res.status(500).send({error:'Error While Getting All Workers...', message:e.message});
    }
});

/**
 * @swagger
 * /worker/details/{id}:
 *   get:
 *     summary: Get details of a worker by ID.
 *     tags:
 *       - Worker
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the worker to retrieve.
 *     responses:
 *       200:
 *         description: Details of the worker.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 weightLimit:
 *                   type: number
 *                 state:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Worker not found.
 *       500:
 *         description: Server error while retrieving worker details.
 */
router.get('/worker/details/:id', async (req: Request, res: Response):Promise<any> => {
    try
    {
        const worker = await Worker.findById(req.params.id);

        if(!worker)
        {
            return res.status(404).send({error:'No Such Worker with Such ID'});
        }

        return res.status(200).send(worker);
    }
    catch (e:any)
    {
        return res.status(500).send({error:'Error While Getting This Worker details...', message:e.message});
    }
});

//Add a New Worker
/**
 * @swagger
 * /worker/add:
 *   post:
 *     summary: Add a new worker.
 *     tags:
 *       - Worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               weightLimit:
 *                 type: number
 *                 example: 120
 *               password:
 *                 type: string
 *                 example: "securePass123"
 *     responses:
 *       201:
 *         description: Worker successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 worker:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     weightLimit:
 *                       type: number
 *                     state:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 token:
 *                   type: string
 *                 success:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Worker could not be created.
 *       500:
 *         description: Server error while adding a worker.
 */
router.post('/worker/add', async(req: Request, res: Response):Promise<any> => {
    try
    {
        const worker = new Worker(req.body);

        await worker.save();

        //If Worker Couldn't be created
        if(!worker)
        {
            return res.status(404).send("User Could not be created!");
        }

        //Generate a Token for this Worker and send it
        // @ts-ignore
        const token = await worker.generateAuthToken();

        return res.status(201).send({worker, token, success:1});
    }
    catch (e: any)
    {
        return res.status(500).send({error:'Error While Adding A Worker...', message:e.message});
    }
});

// Get Most Completed Missions Descending
/**
 * @swagger
 * /worker/mostCompleted:
 *   get:
 *     summary: Get workers ranked by the number of completed missions.
 *     tags:
 *       - Worker
 *     responses:
 *       200:
 *         description: List of workers with their completed mission count, sorted in descending order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       workerId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       completedMissions:
 *                         type: integer
 *       500:
 *         description: Server error while retrieving workers with most completed missions.
 */
router.get('/worker/mostCompleted', async (req: Request, res: Response): Promise<any> => {
    try {

        const mostCompletedMissions = await Mission.aggregate([
            {
                // Filter missions to only include 'finished' missions
                $match: { state: 'finished' }
            },

            {
                // Group missions by workerId
                $group: {
                    _id: "$worker",
                    completedMissions: { $sum: 1 }
                }
            },
            {
                // Sort in descending order
                $sort: { completedMissions: -1 }
            },

            {
                // populate each worker details
                $lookup: {
                    from: "workers", // Collection name for workers
                    localField: "_id",
                    foreignField: "_id",
                    as: "workerDetails"
                }
            },

            {
                // Unwind the workerDetails array
                $unwind: "$workerDetails"
            },

            {
                // Project fields to include only necessary information
                $project: {
                    _id: 0,
                    workerId: "$workerDetails._id",
                    name: "$workerDetails.name",
                    completedMissions: 1
                }
            }
        ]);

        return res.status(200).send({ data: mostCompletedMissions });
    }
    catch (e: any) {
        return res.status(500).send({
            error: 'Error While Getting Most Completed Missions...',
            message: e.message
        });
    }
});


export default router;