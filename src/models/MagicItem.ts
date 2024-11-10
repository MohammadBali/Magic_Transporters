import mongoose, {Document, Schema} from 'mongoose';

/**Interface of this entity**/
export interface MagicItem extends Document
{
    _id: Schema.Types.ObjectId;
    name:String;
    weight:Number;

    createdAt:any,
    updatedAt:any,
}

const itemSchema: Schema = new Schema({

    name:{
        type: String,
        required:true,
        trim:true,
        unique:true,
    },

    weight:{
        type:Number,
        required:true,
        default:0
    },

}, {timestamps:true});

export const Item = mongoose.model<MagicItem>('Item', itemSchema);