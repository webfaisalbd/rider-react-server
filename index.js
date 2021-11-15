const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0pni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        console.log("database successfully connected");
        const database = client.db('rider_db');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('review');
        const buyerCollection = database.collection('buyer');



        // GET API for Services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API for Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API for services
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // POST API users 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

       

        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);


        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })


         // POST API for review
         app.post('/review', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await reviewCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

         // GET API for review
         app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


         // post api for buyer
       app.post('/buyer',async(req,res)=>{
            
        const user =req.body;
        console.log('hit the post buyer api',user);
        // res.send('post hitted');
        const answer = await buyerCollection.insertOne(user);
        console.log(answer);
        res.json(answer)
    });


    // GET API for buyer
    app.get('/buyer', async (req, res) => {
        const user = buyerCollection.find({});
        const getUser = await user.toArray();
        console.log(getUser);
        res.send(getUser);
    });


    // approved the status
  app.put("/buyer/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const filter = { _id: ObjectId(id) };
    const updateDoc = {
        $set: data,
    };
    const result = await buyerCollection.updateOne(filter, updateDoc);
    res.json(result);
});


// DELETE API
app.delete('/buyer/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await buyerCollection.deleteOne(query);
    res.json(result);
})







    }

    finally {

        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello products')
})

app.listen(port, () => {
    console.log(`listening at${port}`)
})