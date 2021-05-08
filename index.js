const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lahub.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('error : ',err);

  const serviceCollection = client.db("happyhousing").collection("services");
  const projectCollection = client.db("happyhousing").collection("projects");
  const reviewsCollection = client.db("happyhousing").collection("reviews");
  const contactCollection = client.db("happyhousing").collection("contact");
  const adminCollection = client.db("happyhousing").collection("team");
  const orderCollection = client.db("happyhousing").collection("orders");
  console.log('successFull');

// server creation
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Adding services

  app.post('/addservice', (req, res)=>{
    const service = req.body;
    serviceCollection.insertOne(service)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
     
  })
//Adding Projects
  app.post('/addproject', (req, res)=>{
    const project = req.body;
    projectCollection.insertOne(project)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
     
  })
// posting customer review
  app.post('/addreview', (req, res)=>{
    const review = req.body;
    console.log(review);
    reviewsCollection.insertOne(review)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
     
  })
// post contact request
  app.post('/contact', (req, res)=>{
    const contact = req.body;
    contactCollection.insertOne(contact)
    .then(result =>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
     
  })
// posting admin request
  app.post('/addmember',(req,res)=>{
     const member = req.body;
     adminCollection.insertOne(member)
     .then(result=>{
      console.log('inserted count: ',result.insertedCount)
      res.send(result.insertedCount > 0)
     })
  })

  // posting order request
  app.post('/order',(req,res)=>{
    const order = req.body;;
    orderCollection.insertOne(order)
    .then(result=>{
     console.log('inserted count: ',result.insertedCount)
     res.send(result.insertedCount > 0)
    }
    )
 })





// reading service data
  app.get('/services',(req,res)=>{
    serviceCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })


// reading recent projects data
  app.get('/projects',(req,res)=>{
    projectCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })
// reading testimonials
  app.get('/reveiws',(req,res)=>{
    reviewsCollection.find()
    .toArray((err, items)=>{
      res.send(items);
    })
  })

// reading Admin data
app.get('/admin',(req,res)=>{
  adminCollection.find()
  .toArray((err, items)=>{
    res.send(items);
  })
})

//reading contact request data
app.get('/readContactreq',(req,res)=>{
  contactCollection.find()
  .toArray((err, items)=>{
    res.send(items);
  })
})
 
// reading data of a specific service for provide details in checking out 
app.get('/checkout',(req,res)=>{
  serviceCollection.findOne({_id:ObjectId(req.query.Id)})
  .then(result=>{
    res.send(result);
  })
})

// reading data of orders
app.post('/orders',(req,res)=>{
  let filter;
  const useremail = req.body.email;
  adminCollection.find({email:useremail})
  .toArray((err, items)=>{
    if(items.length === 0){
     filter = {email:useremail}   
    }
    orderCollection.find(filter)
    .toArray((err, orders)=>{
    res.send(orders)
    
  })
})
})
// checking Admin or not
app.get('/isAdmin',(req,res)=>{
  adminCollection.find({email:req.query.email})
  .toArray((err, items)=>{
    res.send(items.length > 0);
  })
})


  // deleteing data from admin using table button
  app.delete('/deleteadmin/:id',(req,res)=>{
    const adminId = req.params.id;
    adminCollection.deleteOne({_id:ObjectId(adminId)})
    .then(result=>{
      res.send(result.modifiedCount > 0);
    })
  })

  // deleteing data from service using table button
  app.delete('/servicedelete/:id',(req,res)=>{
    const serviceId = req.params.id;
    serviceCollection.deleteOne({_id:ObjectId(serviceId)})
    .then(result=>{
      res.send(result.modifiedCount > 0);
    })
  })
// updating data of service status
  app.patch('/update/:id',(req,res)=>{
    const orderId = req.body.id;
    const newStatus = req.body.status;
    orderCollection.updateOne({_id:ObjectId(orderId)},{
      $set:{status:newStatus}
    }
    )
    .then(result=>{
      res.send(result.modifiedCount > 0);
      // console.log(result);
    })
  })

  // client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


