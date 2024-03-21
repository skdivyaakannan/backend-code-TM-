import mongoose from "mongoose";



const User = new mongoose.Schema({
  username : {
    type: String,
    required:[true,"Please enter a Username.."]
  },
  email:{
    type: String,
    required:true,
},
password:{
  type:String,
  required:true,
  unique:true
}
},
{
    timestamps: true
}
)
const UserCollection = mongoose.model("UserCollection",User);
export default UserCollection;