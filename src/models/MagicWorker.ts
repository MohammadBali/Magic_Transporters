import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import constants from "../shared/constants";
import validator from "validator";

/**Interface of this entity
 * The Worker members
 * @member _id ObjectID, the ID of this Worker
 * @member name String, the name of this Worker
 * @member weightLimit Number, The Weight Limit that this worker can handle; should not be exceeded
 * @member password String, hashed Password
 * @member state String, The State of this Worker
 * @member token List<String>, contains every token of this user
 * @member createdAt any, The Date of this worker creation
 * @member updatedAt any, The last date when this worker was updated
 * **/
export interface MagicWorker extends Document
{
    _id: Schema.Types.ObjectId;
    name: String;
    weightLimit: Number;

    password:String;
    state: 'resting' | 'loading' | 'onMission';
    token: [{token:string}],

    email:String;
    createdAt:any,
    updatedAt:any,

}

/**Define the Worker Schema in the DB**/
const workerSchema: Schema = new Schema({

    name:{
        type: String,
        required:true,
        trim:true,
    },

    weightLimit:{
        type: Number,
        required:true,
        default:100,
    },

    state:{
        type: String,
        required:true,
        enum:['resting', 'loading', 'onMission'],
        default:'resting',
    },

    password:{
        type: String,
        trim:true,
        required:true,
        minlength:7,
        validate(value:any){
            if(value.toLowerCase().includes('password')) //The Password contains the word password
            {
                throw Error('Password format is not correct');
            }
        },
    },

    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true,
        validate(value: any)
        {
            if(!validator.isEmail(value))
            {
                throw Error('The Email Provided is not a correct syntax.');
            }
        },
    },

    tokens:
        [
            {
                token:{
                    type:String,
                    required:true
                },
            }
        ],

}, {timestamps:true});

//Telling Mongoose that the worker is foreign key for the mission.
workerSchema.virtual('worker',{
    ref:'Mission',
    localField:'_id',
    foreignField:'worker'
});

//Pre Saving The Worker; Hash his password then proceed
workerSchema.pre('save', async function(next){
    const worker=this;

    if(worker.isModified('password')) //Check if the password is being changed => Hash it
    {
        console.log('in Pre User, Hashing Password...');
        worker.password= await bcrypt.hash(worker.password as string,8);
    }

    next();
});

//Static Method for each object of Worker type to check his credentials
workerSchema.statics.findByCredentials= async (email,password)=>{

    const worker= await Worker.findOne({email});
    if(!worker)
    {
        throw Error('Unable to Login, No Such worker exists');
    }

    //Hash the password and compare it to the stored hash.
    const isMatch=await bcrypt.compare(password,worker.password as string);

    //Password is Wrong
    if(!isMatch)
    {
        throw Error('Wrong Credentials');
    }

    return worker;
}

//Generate Authorization Tokens
workerSchema.methods.generateAuthToken= async function() {
    const user=this;
    const token= jwt.sign({_id: user._id.toString()}, constants.SignKey as string);

    //Adding Token to the worker's info.
    user.tokens=user.tokens.concat({token});

    await user.save();

    return token;
};

//Always Remove the password & tokens for security matters
workerSchema.methods.toJSON= function()
{
    const worker=this;
    const workerObject= worker.toObject();

    delete workerObject.password;
    delete workerObject.tokens;

    return workerObject;
};

export const Worker = mongoose.model<MagicWorker>('Worker', workerSchema);