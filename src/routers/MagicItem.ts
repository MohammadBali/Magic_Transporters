import express, {Request, Response} from 'express';
import auth from "../middleware/auth";
import {Item} from "../models/MagicItem";
import {Mission} from "../models/MagicMission";

/**Item Router, contains the Endpoints of items & their logic**/
const router = express.Router();

//Get All Items in the system
/**
 * @swagger
 * /item/all:
 *   get:
 *     summary: Retrieve a list of all items in the system.
 *     tags:
 *       - Item
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       weight:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error while retrieving items.
 */
router.get('/item/all', auth.userAuth, async (req: Request, res: Response):Promise<any> => {

    try
    {
        const items = await Item.find();

        return res.status(200).send({items:items});
    }
    catch (e:any)
    {
        return res.status(500).send({error:'Could not get all items...', message:e.message});
    }
});

//Get Item Info
/**
 * @swagger
 * /item/details/{id}:
 *   get:
 *     summary: Get details of an item by its ID.
 *     tags:
 *       - Item
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the item to retrieve.
 *     responses:
 *       200:
 *         description: Details of the specified item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Item not found.
 *       500:
 *         description: Server error while retrieving item details.
 */
router.get('/item/details/:id', async (req: Request, res: Response):Promise<any> => {
    try
    {
        const item = await Item.findById(req.params.id);

        if(!item)
        {
            return res.status(404).send({error:'No Such Item with Such ID'});
        }

        return res.status(200).send(item);
    }
    catch (e:any)
    {
        return res.status(500).send({error:'Error While Getting This item details...', message:e.message});
    }
});

//Add a New Item to the system
/**
 * @swagger
 * /item/add:
 *   post:
 *     summary: Add a new item to the system.
 *     tags:
 *       - Item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample Item"
 *               weight:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Item successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Item could not be added.
 *       500:
 *         description: Server error while adding the item.
 */
router.post('/item/add', async(req: Request, res: Response):Promise<any> => {
    try
    {
        const item = new Item(req.body);

        await item.save();

        if(!item)
        {
            return res.status(404).send({error:'Item could not be added!'});
        }

        return res.status(201).send({item:item});
    }
    catch(e:any)
    {
        return res.status(500).send({error:'Error While Adding Item...', message:e.message});
    }
});


export default router;