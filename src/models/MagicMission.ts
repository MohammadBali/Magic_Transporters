import mongoose, {Document, Schema} from 'mongoose';

/**
 * MagicMission is the Mission that the worker operates in
 * @member _id ObjectID, the ID of this mission
 * @member worker any, Type is any because it may be just his ID or a populated field
 * @member items any, Type is any because it may be just his ID or a populated field
 * @member state String, The State of this Mission
 * @member createdAt any, The Date of this mission creation
 * @member updatedAt any, The last date when this mission was updated
 * **/

export interface MagicMission extends Document {
    _id:Schema.Types.ObjectId;
    worker:any;
    items:[any];


    state:'in_progress' | 'finished' | 'failed';
    createdAt:any,
    updatedAt:any,
}

const missionSchema: Schema = new Schema({

    worker:{
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required:true,
    },

    items:[
        {
            _id:false,

            itemId:{
                type:Schema.Types.ObjectId,
                ref: 'Item',
                required:false,
            },
        },
    ],

    state:{
        type:String,
        enum:['in_progress','finished','failed'],
        default:'in_progress',
    },

}, {timestamps:true});

export const Mission = mongoose.model<MagicMission>('Mission', missionSchema);

// Add virtual for populating items based on itemId (if needed)
missionSchema.virtual('populatedItems',{
    ref:'Item',
    localField:'items.itemId',
    foreignField:'_id',
    justOne: false
});