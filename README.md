                                                                     # cab_booking_system
                                                                     
                                                                    
Setup
========
1)Clone the repository.
2)Run npm install to install all dependencies.
3)Run npm start to run the project.    




                                                               Authentication Mechanism:-
                                                              ==========================
                                                              
                                                              

 1)Register or signup
  ------------------

1)npm install init

2)npm install mongodb

3)npm install express

4) npm install bcrypt

5) getting or collecting data from client (UserName,Password)

6)Establishing connection with Database

7)checking if the data (UserName,Password) already Exists 

     a)if(Exists)
         
        Send already exists message

    b) else
 
      Add it to databse collection

      Password should be encrypted and stored in the database

Encryption:-
============

1)A npm module named bcrypt is used to encrypt the password 

      npm install bcrypt

2) it is a two step procedure 

  a)In bcrypt genSalt is there which acts as a key which is responsible to generte the hash

        let salt=genSalt(Number of rounds);

     
    rounds=8 : ~40 hashes/sec
    rounds=9 : ~20 hashes/sec
    rounds=10: ~10 hashes/sec
    rounds=11: ~5  hashes/sec
    rounds=12: 2-3 hashes/sec
    rounds=13: ~1 sec/hash
    rounds=14: ~1.5 sec/hash
    rounds=15: ~3 sec/hash
    rounds=25: ~1 hour/hash
    rounds=31: 2-3 days/hash

   As no of rounds increases time taken to genearte hash delays

 b) let hash=bcrypt.hash(password,salt);
 
    Hash is a method which accepts two paramters , a plain text password and salt using which it generates hash


 Route:
 =====

 route : /register
-------------------

   Method    : Post

   http://localhost/register/


   


Response Expample:-
==================

 HTTP/1.1 200 Success

    {
      "message": "user registered "
    }            



  Client Error 4XXX
 =====================

Response Expample:-
==================

 HTTP/1.1 400 Bad Request

    {
      "message": "user Already Exists"
    } 




2)Login   :-
  ========



1)npm install init

2)npm install mongodb

3)npm install express

4) npm install bcrypt

5) getting or collecting data from client (UserName,Password)

6)Establishing connection with Database

7)collect the data and check whether record exists or not 

   if(exists )
    
     decrypt password and verify the record

       if(true)
          redirect to homepage by sending a message login successful

       else 
         login unsuccessful

  else
    User not Registered


Decryption:
===========

A compare method is present in bcrypt which compares both our plain text password and password which is stored in db and returns a boolean status

   let isValid= bcrypt.compare(req.body.password,data.password);

 if(true):
    login successful

  else 
    login unsuccessful


Route:-
=======

   Method : Post

Route:
======
   http://localhost/login/


   

   Success 200 Response:
   ====================
   
        

Response Expample:-
==================

 HTTP/1.1 200 Success

    {
      "message": "login successful"
    }            



  Client Error 4XXX
 =====================

Response Expample:-
==================

 HTTP/1.1 400 Bad Request

    {
      "message": "login unsuccessful"
    } 


  HTTP/1.1 404 NotFound

    {
      "error": "user not registred"
    } 

                                                                    
                        
                        
                        
                        
                                                        API DOCUMENTATION:-
                                                        ====================
                                                        
                                                        
 1) Book a cab
   ==========

  Method : GET

Route:
======
   http://localhost:3000/book?lattitude={lattitude}&longitude={longitude}&color={color}


 Parameters:
============


 Field                        Type                   Description
========                      =====                  ============
 latitude                     String                lattitude of the user
 
 longitude                    String                longitude of the user

 color                        String                color of the cab required 


Booking a cab is done by using a nearby or getclosest cab functinality:-
======================================================================

1) A function is written which returns us the nearest location cab based on the paramters provided

2)Function accepts two parameterd location and color

    lcoation ----> takes latitude and longitude which we provide in the query

3) The book api gets the closest location from the function and based on that it return the data

4) it returns
   a)cabid
   b)driver name
   c)driver phonenumber 
   d)passengerUsername
   e)location




Success 200 Response:
 ====================

 HTTP/1.1 200 Success
{

   "cabid":"1",
   "drivername":"xyz",
   "driverphonenumber":"7737737337", 
   "passengerUsername":"abc"
   "location":"nizampet"

}


 Client Error 4XXX
 =====================

Response Expample:-
==================

   HTTP/1.1 400 Bad Request

    {
      "message": "No cabs avialable"
    }


   HTTP/1.1 400 not found

    {
      "message": "Invalid/Missing parameters"
    }




2) GetAllBookings of a client:-
  ===========================


Method  :  GET

Route:
======        
http://localhost/getAllBookings


Paramters:-
============

 field              type

 id                 string



Success 200 Response:
 ====================

 HTTP/1.1 200 Success
{

   "userName":"gshs",
   "email":"ahahh@gmailcom",
   "cabid:"1"

}


Client Error 4XXX
 =====================

Response Expample:-
==================

   


   HTTP/1.1 400 not found

    {
      "message": "Invalid/Missing parameters"
    }

    


3) Inserting Cab details:-
=========================


Method :post

Route:
======

 http://localhost/cabDetails



Success 200 Response:
 ====================

 HTTP/1.1 200 Success
{

   "message:"cab details posted successfully";

}



 





                        
                        
                        
                        
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
                                                                    
               
