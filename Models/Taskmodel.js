import mongoose from "mongoose";



const Usertask = new mongoose.Schema({
  taskname : {
    type: String,
    required:true,
  },
  taskdetails:{
    type: String,
    required:true,
},
taskassigned:{
  type:Array,
  required:true,
 
},
taskstatus:{
  type:String,
  required:true,
 
},
task_uuid:{
  type:String,
},

},
{
    timestamps: true
}
)
const TaskCollection = mongoose.model("TaskCollection",Usertask);
export default TaskCollection;