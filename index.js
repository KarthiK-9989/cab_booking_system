// env file is a simple configuration file ,in which we stores password , database urls 
if(process.env.NODE_ENV!== 'production'){
    require('dotenv').config();     
}
 // importing mongodb
const mongodb=require("mongodb");  

var ObjectId = require('mongodb').ObjectID; 

//The MongoClient class is where the initial connection to the MongoDB server is defined.
const mongoClient=mongodb.MongoClient; 

// importing expressjs
const express=require('express');

// we cannot directly access http method of express so we acquire it as an object and by using it we write http methods like
// app.get, app.post,app.put,app.delete
const app=express();

//importing bcrypt ,it is used to encrypt the password
const bcrypt=require("bcrypt");

//it is a body parser which parses the json object
//express.json() is a built express middleware that convert request body to JSON.
app.use(express.json());  



//here we are fetching runtime PORT ,if not hardcoded port number
const port=process.env.PORT || 3000;

//here we are trying to fetch databse url from environment variable 

const dburl=process.env.DATABASE_URL || "mongodb://127.0.0.1:27017";




//   Api for Registration or Creating a Account


app.post('/register',async(req,res)=>{
 try{

    // connecting mongodb using mongodb driver which is mongoclient , not to get any error in old versions of mongodb we mention
    // useunifiedtopology as true
    let clientInfo=await mongoClient.connect(dburl,{useUnifiedTopology: true });

    // getting coonected to db named jobPortal Data
       let db=clientInfo.db("cabBookingDb");

      // fetchig email id and verifying whether it exists or not
    let dataFound=await db.collection("clientData").findOne({email:req.body.email});
        if(dataFound){
            res.status(400).json({message:"user already exists"})
        }
        else{
            // encypting the password and storing into the database
            let salt=await bcrypt.genSalt(10);
            let hash=await bcrypt.hash(req.body.password,salt);
            req.body.password=hash;
            await db.collection("users").insertOne(req.body);
            res.status(200).json({message:"user registered"});
           }
           clientInfo.close();
       }
 
        catch(error)  // if any error it displays the error
        {
            console.log(error);
        }
    });




  //    User Login Api

app.post("/login",async(req,res)=>{

    try{
        // connecting mongodb using mongodb driver which is mongoclient , not to get any error in old versions of mongodb we mention
       // useunifiedtopology as true
        let clientInfo=await mongoClient.connect(dburl,{useUnifiedTopology: true });

         // getting coonected to db named jobPortal Data
         let db=clientInfo.db("cabBookingDb");

         
      // fetchig email id and verifying whether it exists or not
        let data=await db.collection("ClientData").findOne({email:req.body.email});
        if(data){
            // decypting the password and comapring it, which fianlly returns the boolean value
            let isValid=await bcrypt.compare(req.body.password,data.password);
                if(isValid)
                {
                    res.status(200).json({message:"login successfull"});
                }
                else{
                    res.status(400).json({message:"login unsuccessfull"})
                }
        }
        else{
            res.status(404).json({message:"user not registred"});
        }
    }
        catch(eeror){
            console.log(error);
        }
    
})




//  get all previous bookings of a cab

app.get('/getAllBookings/:id',async(req,res)=>{
    
   
    try{
        // connecting mongodb using mongodb driver which is mongoclient , not to get any error in old versions of mongodb we mention
       // useunifiedtopology as true
        let clientInfo=await mongoClient.connect(dburl,{useUnifiedTopology: true });

         // getting coonected to db named jobPortal Data
        let db=clientInfo.db("cabBookingDb");

        //fetching the particular data from collection which matches the given query
        let data=await db.collection("cabData").findOne({userName:req.params.id}).toArray();

        //if you dont want to show customer's password,or address, you can use the follwoing code 

        // let cust_data= await db.collection("customer_details").findOne({cust_id:req.params.id}).project({password:0, address:0});


        // if success data is sent to server
        res.status(200).json(data);

        //closing the mongodb connection
        clientInfo.close();
    }
    catch(error){  // it displays the error if any error oocurs or exception occurs
        console.log(error);
    }

   });

   



 //  INSERTING the cab Details into the database


app.post("/cabDetails",async(req,res)=>{
    try{
        // connecting mongodb using mongodb driver which is mongoclient , not to get any error in old versions of mongodb we mention
       // useunifiedtopology as true
        let client=await mongoClient.connect(dburl,{useUnifiedTopology: true });

        // getting coonected to db named jobPortal Data
        let db=client.db("cabBookingDb");

           //inserting the cab related details
        await db.collection("cabdata").insertOne(req.body);

        // if success data is inserted into database and message is displayed
        res.status(200).json({message:"cabDetails posted successfuly"});

        
        //closing the mongodb connection
        client.close();
    }
    catch(error){           // it displays the error if any error oocurs or exception occurs
        console.log(error);
    }

   
});




   
// booking a cab APi

  app.get("/book",async(req,res)=>{
    try{
        let client=await mongoClient.connect(dburl,{useUnifiedTopology: true });
        let db=client.db("cabBookingDb");
        let data=await db.collection("cabdata").find().toArray();

        // passing latitude and longitude and color as the query parameters
        if (req.query.lattitude && req.query.longitude && !isNaN(req.query.lattitude) && !isNaN(req.query.longitude)) {

                  // as query paramters are strings we typecast them using parseInt function
                    var lattitude = parseInt(req.query.lattitude);
                    var longitude = parseInt(req.query.longitude);
                    var userLocation = {
                    lattitude: lattitude,
                    longitude: longitude
                    };
                    var color = req.query.color || null;

                    // calling the closest cab or nearby cab functionality
                    var cab = getClosestCab(userLocation, color);
                    if (cab) {
                    data.isBooked = true;
                    res.status(200).json({message: "Cab booked!",data});
                    }
                    else{
                        res.status(400).json({message:"No cabs available!"})
                    }
                    client.close();
                }

              else {
                res.status(404).json({message: "Invalid/Missing parameters"});
               }
         }
       catch(error){
        console.log(error);
       }

  })

  


  
  // closest cab or nearby cab functionality

  async function  getClosestCab (location, color) {
    try{
            let client=await mongoClient.connect(dburl,{useUnifiedTopology: true });
                let db=client.db("cabBookingDb");
                let data=await db.collection("cabdata").find().toArray();
                var closest = null;     //intially considering no closest cab is available 

                //intially considering distance of closest cab is Infinity 
                //Infinity is a numeric value that represents positive infinity.
                // which is nothing but 1.797693134862315E+308 is the limit of a floating point number.
                var closestDistance = Infinity; 
        
            // iterating over each value of document and applying conditions
            data.forEach(function(cab) {
            if (!cab.isBooked) {
                if (color) {
                if (color.toUpperCase() === cab.color) {

                    // calling the getDistance Method
                    var distance = getDistance(cab.location, location);
                    if (distance < closestDistance) {
                    closestDistance = distance;
                    closest = cab;
                    }
                }
                } else {
                var distance = getDistance(cab.location, location);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closest = cab;
                }
                }
        
            }
            });
   }
    catch(error){
        console.log(error);
    }

    return closest;  // returning the closest cab
  }




  // get distance between user and cab

  function getDistance(location1, location2) {
    var a = location1.lattitude - location2.lattitude;
    var b = location1.longitude - location2.longitude;
    var c = Math.sqrt(a*a + b*b);
    return c;
  }



 // making our application to listen to the port
app.listen(port,()=>{
    console.log("server started with"+ " "+port);
});




