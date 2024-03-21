import 'dotenv/config'
import cors from 'cors'
import  express  from 'express';
import mongoose from 'mongoose';
const app = express();
import UserRouter from './Routes/user.js'
import AuthRouter from './Routes/auth.js'
import TaskRouter from './Routes/task.js'
import cookieParser from "cookie-parser";

app.use(express.json())
app.use(cookieParser())
app.use(cors())
 const PORT = process.env.PORT || 8080;
 




app.get('/tasks',(req,res)=>{
    console.log("hello")
    return res.send('Backend server for Task Management');
})
app.use("/api/user",UserRouter)
app.use("/api/task",TaskRouter)
app.use("/api/auth",AuthRouter)





mongoose.connect('mongodb+srv://Divyaa:Divyaa21@cluster0.cjtpmmp.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    console.log('connected to MongoDB..')
    
}).catch((error)=>{
    console.log(error)
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost`);
  });