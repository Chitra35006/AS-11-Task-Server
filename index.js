const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()

const port = process.env.PORt || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vcwkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const usersCollection = client.db("taskDB").collection("users");
    const tasksCollection = client.db("taskDB").collection("tasks");

    app.post("/users", async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          return;
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });
    
      app.get("/users", async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });

                 // post new task
                 app.post("/tasks", async (req, res) => {
                    const task = req.body;
                    task.timestamp = new Date(); 
                    const result = await tasksCollection.insertOne(task);
                    res.json(result);
                });
          
                // get all task
                app.get("/tasks", async (req, res) => {
                    const tasks = await tasksCollection.find().toArray();
                    res.json(tasks);
                });
          
                // update task
                app.put("/tasks/:id", async (req, res) => {
                    const id = req.params.id;
                    const { _id, ...updatedTask } = req.body;  
                    const result = await tasksCollection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: updatedTask }
                    );
                    res.json(result);
                });
          
                //delete api
                app.delete("/tasks/:id", async (req, res) => {
                    const id = req.params.id;
                    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
                    res.json(result);
                });
          

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('task is sitting')
})

app.listen(port,()=>{
    console.log(`Todo task is sitting on Port ${port}`);
})