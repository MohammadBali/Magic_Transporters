import mongoose, {Document, Schema} from 'mongoose';

/**Interface of this entity
 * The Item members
 * @member _id ObjectID, the ID of this Item
 * @member name String, the name of this Item
 * @member weight Number, the weight of this Item
 * @member createdAt any, the date of creation, should be parsed as a date
 * @member updatedAt any, the date when this item was updated
 * **/
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