      import express from 'express';
import TaskCollection from '../Models/Taskmodel.js';
import {v4 as uuidv4} from 'uuid'
import Joi from 'joi';



const User = Joi.object().keys({
  taskname : Joi.string().min(3).max(10).required(),
  taskdetails: Joi.string().required(),
  taskassigned:Joi.array().items(Joi.string().email()).required(),
 })

 const email = Joi.object().keys({
  assigned:Joi.string().required(),
 })


const validate = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);  //intha sche  ma.validate is a func in joi which helps in checking validations of input 
  if (error) {
    res.status(422).send(error.details);
  } else {
    next();
  }
};
const validatesearch = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.query);  //intha schema.validate is a func in joi which helps in checking validations of input 
  if (error) {
    res.status(422).send(error.details);
  } else {
    next();
  }
};



const TaskRouter = express.Router();

//add tasks button

TaskRouter.post('/taskdata',validate(User),async(req,res)=>{

  try {
    
    let {taskname,taskdetails,taskassigned}= req.body;

    let newtask  = new TaskCollection({
        taskname : taskname,
        taskdetails : taskdetails,
        taskassigned : taskassigned,
        taskstatus : "pending",
        task_uuid: uuidv4(),
          
      
        
    })
    console.log(newtask ,"save")

    const data = await newtask.save();
    if(data){
        return res.status(200).send(data);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
    data = await newtask.save();
    
})
//my tasks button
TaskRouter.get("/mytasks",validatesearch(email),async(req,res)=>{
    let {assigned} = req.query;
    console.log(assigned,"asigned")
    try {
      const tasks = await TaskCollection.find( { taskassigned:{ $in : [assigned]}});
    
      if(tasks){
        return res.status(200).send(tasks)
      }
    } catch (error) {
     
      return res.status(500).send(error);
    }

    
    
})
//get api for search bar
TaskRouter.get('/searchbar',async(req,res)=>{
  try{
  const {taskname} = req.query;
  console.log("taskname",taskname);
  const Taskname = await TaskCollection.find({taskname:{ $in: [taskname] }});
  console.log(Taskname,"1111111")
  if(Taskname){
    res.send(Taskname);
    console.log(Taskname);
  }
  

  }
  catch (error) {
    return res.status(500).send(error);
  }


})
//count api in home page
TaskRouter.get("/getstatuscount",async(req,res)=>{
  try{
   let pendingCount;
   let acceptcount;
   let cancelledCount;
    
   pendingCount = await TaskCollection.countDocuments({taskstatus: 'pending'})
   acceptcount = await TaskCollection.countDocuments({taskstatus: 'accept'})
   cancelledCount = await TaskCollection.countDocuments({taskstatus: 'Cancel'})

  if(pendingCount || acceptcount || cancelledCount){
    res.status(200).json({
      "pendingCount":pendingCount,
      "acceptCount": acceptcount,
      "cancelCount": cancelledCount 
    })
  }




  }

  catch(error){
    res.send(error);
  }
})

//for updating status in my tasks

TaskRouter.post('/statusUpdate', async (req, res) => {
  const { taskstatus, task_uuid } = req.body;
  console.log(task_uuid, "status");

  try {
   
    
    const update = await TaskCollection.updateOne({ task_uuid: task_uuid }, { $set: { taskstatus: taskstatus } });

    if (update) {
      console.log(update, 'update');
     return res.status(201).send(update);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});
// to delete the tasks

TaskRouter.delete("/taskdelete/:task_uuid", async(req,res)=>{
  try {
    const task_uuid = req.params.task_uuid ; 
    console.log(task_uuid);

  const del = await TaskCollection.deleteOne({task_uuid:task_uuid});
  if(del){
    console.log(del);
   return  res.status(200).send('deleted successfully');
  }
  } catch (error) {
    return res.status(500).send(error);
  }
  
})

export default TaskRouter;