const express = require('express');
// cors
// ----------------------------------
/**
 * CORS is a part of HTTP that lets servers 
 * specify any other hosts from which a browser 
 * should permit loading of content.
 */
// ----------------------------------
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//import dotenv
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
// ----------------------------------
/**
 * Middleware is software that bridges
 *  gaps between other applications,
 * tools, and databases in order to
 *  provide unified services to users.
 */
// ----------------------------------
app.use(cors());
// express json
// ----------------------------------
/**
 * This method is used to parse the incoming 
 * requests with JSON payloads and is based upon the bodyparser. 
 */
// ----------------------------------

app.use(express.json());
// Create a root API



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qdexp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        // You can get data by searching localhost:5000/service
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

            app.get('/service/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const service = await serviceCollection.findOne(query);
                res.send(service);

            });
            // POST
            app.post('/service', async (req, res) => {
                const newService = req.body;
                const result = await serviceCollection.insertOne(newService);
                res.send(result);
            })

            // DELETE

            app.delete('/service/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await serviceCollection.deleteOne(query);
                res.send(result);
            })


        })
    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running Genius Server");
})


app.listen(port, () => {
    console.log("Listening to port", port);
})
