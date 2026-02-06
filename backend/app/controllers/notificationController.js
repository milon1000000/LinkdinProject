import Notification from "../model/notificationsModel.js";

export const getNotifications=async(req,res)=>{
    const userId=req.headers.user_id;
    console.log(userId)
    try{
      const notification=await Notification.find({receiver:userId}).populate("relatedUser","firstName lastName profileImage").populate("relatedPost","image description");
      return res.status(200).json({message:"get notification successful",success:true,notification})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"get notification error",error:error.message,success:false});

    }
}

export const deleteNotifications=async(req,res)=>{
    const {id}=req.params;
    try{
     await Notification.findByIdAndDelete(id);
      return res.status(200).json({message:"delete notification successful",success:true})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"delete notification error",error:error.message,success:false});

    }
}

export const clearAllNotifications=async(req,res)=>{
    const userId=req.headers.user_id;
    try{
     await Notification.deleteMany({receiver:userId});
      return res.status(200).json({message:"all delete notification successful",success:true})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"delete all notification error",error:error.message,success:false});

    }
}