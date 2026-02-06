import mongoose from "mongoose";
import { type } from "os";

const postSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description:{
        type:String,
        default:""
    },
    image:{
       url:{type:String,default:""},
       public_id:{type:String,default:""}
    },
    like:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comment:[
        {
            content:{type:String},
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            createdAtDate:{type:Date,default:Date.now}
        }
    ]
},{timestamps:true});

const Post=mongoose.model("Post",postSchema);
export default Post;