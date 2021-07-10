
# Documentation
### API Documentation for SWD website and apps

# *** Structure and basic protocols followed ***

- BASE_URL : The hostname like http://127.0.0.1
- API_PATH : BASE_URL/api
- These paths are subject to change since we are in testing. Create a global variable in your app to accomodate such changes.

## REQUESTS
- GET : GET method is mostly used to get some data from the server. 
- POST : POST method will be used to send some data to the server. ***Passwords*** as a rule of thumb will be sent using POST only so as to not save a log on the server.
 - (NOTE : The same paths can serve different functions when used with different methods like GET OR POST. For example : To get the user profile a GET request has to be sent to API_PATH/usr/profile but to change the user profile a POST request has to be sent to the same endpoint.
- In order to provide a more secure system we use a token system. Passwords of the user are never stored anywhere in any form in the client machine. Instead tokens will be used. 
- You can safely store the tokens on the client machine. 

## RESPONSE : 
Every API response will be in JSON format. It will comprise of three parts : 
- ***Status*** : It is the REST API response code for the request. It will be in header of the json response. Some common REST API response codes used : 
  - 200 : OK 
  - 201 : CREATED 
  - 202 : ACCEPTED 
  - 400 : BAD REQUEST 
  - 401 : UNAUTHORIZED 
  - 422 : UNPROCESSABLE ENTITY
  - 500 : INTERNAL SERVER ERROR
- ***ResponseText*** : This is the actual response of the request.
Example : 
```
Header : 
Status : 200
Content-Type : application/json 
Body : {"token":"70a4c312ad94fc162ae0be45c3c413b93d46199451ebbb6565484ef642407667"}
```

## PROTOCOLS : 
- Don't save the password of the user in any form. 
- Since we are planning to use HTTPS in the revamped site all the passwords will be sent as plain text. Make sure to use POST method though. We don't want a log of the plain text passwords on the server. 
- If the user wants to logout of the website or app, delete the access token.
- We have set a limit to the password length to atleast 5 characters. 
- Similarly emails and phone numbers are validated at the backend for length and proper format. Use proper validation in your app. 

# *** Methods ***
## Authentication : 
- **TOKEN GENERATION** : In our api we use a token system. That means that we send the uid and password once to the server and receive a 64 character token which can be safely stored on the client device. Using the same token subsequent requests will be made. 
**Update : isComplete param is added indication wheather the profile of the user is completed or not. 1 signify completed profile. If the profile is incomplete prompt the user to complete the profile.**
   - END POINT : API_PATH/auth
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'password'
   - RESPONSE : 
   ```
   Status : 200
   Body : {
    "token": "078b70674f39e095069aba511c32ad6cb651cd1818706889b69f0189a24ecf02",
    "name": "Ninja",
    "id": "2019A7PS0069H",
    "isComplete" : 0
          }
   ```

- **CHANGE PASSWORD METHOD** : For changing the password of the user.  Every time the password of user is changed by this method, the access token is refreshed i.e. the user will be logged out of the web and apps. The new token is sent in the JSON response. 
   - END POINT : API_PATH/auth/change
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'cpassword' (current password), 'npassword' (new password) [Make sure password is atleast 5 characters long.]
   - RESPONSE : 
   ```
   Status : 201
   Body : {"token":"70a4c312ad94fc162ae0be45c3c413b93d46199451ebbb6565484ef642407667"}
   ```

- **RESET PASSWORD -  GET RESET LINK METHOD** : For receiving a reset link in the BITS mail of the user to reset the password. (Note since we are not in production, for now no actual mails are being sent.)
   - END POINT : API_PATH/auth/reset
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx)
   - RESPONSE : 
   ```
    Status : 201
    Body : {}
   ```

- **RESET PASSWORD -  SET NEW PASSWORD METHOD** : On clicking the reset link the user will be redirected to a web page. The web page will use the uid and the reset_token to send a POST request to this end point along with the new password. Every time the password of the user is reset the access token is refreshed and the new token is sent in the JSON reponse.
   - END POINT : API_PATH/auth/reset
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'reset_token', 'npassword'
   - RESPONSE : 
   ```
    Status : 201
    Body : {"token":"70a4c312ad94fc162ae0be45c3c413b93d46199451ebbb6565484ef642407667"}
   ```

- **TOKEN CHECK METHOD** : To check if a token is valid.
   - END POINT : API_PATH/auth/token_check
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'token'
   - RESPONSE : 
   ```
   Status : 200
   ```
   
- **GOOGLE OAUTH AUTHENTICATION** : Authentication through google oauth id tokens.
   - END POINT : API_PATH/auth/google_oauth
   - METHOD : POST
   - PARAMS : 'id_token'
   - RESPONSE : 
   ```
   Same as with uid, password based authentication. 
   ```
   
## User profile  :                       
- **USER PROFILE - GET METHOD** : The profile of the user contains the entire information about him/her. This method is used to 'get' the profile of the user. 
   - END POINT : API_PATH/usr/profile
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token generated using AUTH method)
   - RESPONSE : 
   ```
      Status : 200
      Body : {"profile":{"uid":"f20191322","name":"Prathmesh Srivastava","id":"2019A7PS01322H","branch":"CSEEEE","hostel":null,"room":"VK022","gender":"M","phone":"6393418824","email":"13prathmesh@gmail.com","dob":"2000-07-12","aadhaar":"12345678","pan_card":"hsjsisksk","category":"General","father":"dummy data","mother":"dummy data","fmail":"dummyata@gmail.com","fphone":"dummy data","foccup":"dummy data","fcomp":"dummy data","fdesg":"dummy data","mmail":"dummda@gmail.com","moccup":"dummy data","mcomp":"None","mdesg":"dummy data","hphone":"dummy data","homeadd":"dummy data","city":"dummy data","state":"dummy data","localadd":"dummy data","guardian":"dummy data","gphone":"dummy data","nation":"Nepal","blood":"B+","med_history":"none","current_med":"none","bank":"SBI","acno":"IDK","ifsc":"IDK","income":"INR 8-12 Lakh","pimage":"","time":"1597182930303","bonafide_no":"IDK","isComplete":1},"hostels":[{"key":"meera","name":"Meera"}}]
   ```     
                       
- **HOSTELS LIST GET** : Since we are making outstations and blacklisting online knowing the correct hostel name is necessary. Hence each hostel has been assigned a key and a name. 
   - END POINT : API_PATH/usr/hostels
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token generated using AUTH method)
   - RESPONSE : 
   ```
    Status : 200
    Body : [{"key":"meera","name":"Meera"},{"key":"vk","name":"Vishwakarma"}]
   ```

- **USER PROFILE - INSERT/UPDATE METHOD** : This method updates the profile of the user. 
   - END POINT : API_PATH/usr/profile
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token generated using AUTH method), 'name', 'id', 'branch', hostel (send key from hostels api), 'room', 'gender', 'phone', 'email', 'dob', 'aadhaar', 'pan_card', 'category', 'father', 'mother', 'fmail', 'fphone', 'foccup', 'fcomp', 'fdesg', 'mmail', 
   'moccup', 'mcomp', 'mdesg', 'hphone', 'homeadd', 'city', 'state', 'localadd', 'guardian', 'gphone', 'nation', 'blood', 'med_history', 'current_med', 'bank', 'acno', 'ifsc', 'income', 'pimage', 'bonafide_no' 
   - RESPONSE : 
   ```
    Status : 201
    Body : {}
   ```
                       
## Mess :                        
- **MESS MESS GET METHOD** : Get the menu for the registered mess of the user   
   - END POINT : API_PATH/mess/menu 
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx) 
   //NOTE : No need of any authentication for this endpoint so no token param 
   - RESPONSE : 
   ```
     {
    "mess": 1,
    "menu": [
      {
        "day": "Sunday",
        "breakfast": "tea, juice",
        "lunch": "raita",
        "snacks": "bhel puri ",
        "dinner": "panner"
      },
      {
        "day": "Monday",
        "breakfast": "Tea, coffee, dosa",
        "lunch": "dal, chawal, roti",
        "snacks": "Pani puri",
        "dinner": "Chicken Biryani "
      },
      {
        "day": "Tuesday",
        "breakfast": "Tea, coffee, ooha",
        "lunch": "roti, dal, papad",
        "snacks": "Samosa",
        "dinner": "Chicken Curry"
      },
      {
        "day": "Wednesday",
        "breakfast": "Tea, coffee, wada sambhar ",
        "lunch": "dal, rice",
        "snacks": "parle-g",
        "dinner": "paneer"
      },
      {
        "day": "Thursday",
        "breakfast": "tea, coffee, pav bhaji ",
        "lunch": "dal, rice, chole",
        "snacks": "noodles",
        "dinner": "Butter Chicken"
      },
      {
        "day": "Friday",
        "breakfast": "Tea, coffee, egg, juice",
        "lunch": "dal, rice, papad, achaar",
        "snacks": "Sev puri",
        "dinner": "Dal, rice, kebabs"
      },
      {
        "day": "Saturday",
        "breakfast": "Tea",
        "lunch": "dal, rice, roti, paneer",
        "snacks": "maggi",
        "dinner": "chicken roll"
      }
    ]
  }
   ```                       
                       
- **MESS GRACES GET METHOD** : Get a list of all applied graces.  
   - END POINT : API_PATH/mess/grace
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token received using auth method)
   - RESPONSE : 
   ```
    [
     {
       "gr_id": 3,
       "uid": "f20191322",
       "name": "Prathmesh",
       "id": "2019A7PS1322Hhh",
       "date": "2020-05-25T18:30:00.000Z",
       "requested_on": "1590157328646",
       "outstation" : 0
     },
     {
       "gr_id": 4,
       "uid": "f20191322",
       "name": "Prathmesh Srivastava",
       "id": "2019A7PS1322H",
       "date": "2020-05-26T18:30:00.000Z",
       "requested_on": "1590162981455",
       "outstation" : 1
     },
     {
       "gr_id": 5,
       "uid": "f20191322",
       "name": "Prathmesh Srivastava",
       "id": "2019A7PS1322H",
       "date": "2020-05-26T18:30:00.000Z",
       "requested_on": "1590163012204",
       "outstation" : 1
     },
     {
       "gr_id": 6,
       "uid": "f20191322",
       "name": "Prathmesh Srivastava",
       "id": "2019A7PS1322H",
       "date": "2020-05-26T18:30:00.000Z",
       "requested_on": "1590163054216",
       "outstation" : 0
     }
   ]
   ```
   - NOTE : outstation = 1 means its a oustation grace and vice versa 
                       
- **MESS GRACE APPLY METHOD** : For applying for grace. 
   - END POINT : API_PATH/mess/grace
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token received using auth method), 'date'
   - RESPONSE : 
   ```
    Status : 201
    Body : {}
   ```
   In case the grace is denied you'll get a error code 400 (BAD REQUEST). In that case the status code will be of the form : 
   ```
    Status : 400
    Body : {
    error : "Mess grace denied as you have already exceeded all the mess graces for this month"
    }
   ```
                        
## Goodies :                         
- **GOODIES GET METHOD** : To get a list of all goodies up for sale along with all the details. We came up with 3 types of goodies : 
1) g_type = 0 : These are mechandises like T-shirts and hoodies. They have multiple sizes and a fixed price for each item. 2) g_type = 1 : They are similar to merchandises but they dont have sizes, for example tickets. Multiple quantity can be purchases and each item has a fixed price. 3) g_type = 2 For example fund raisers. They don't have any sizes. **For each type of goodie make propers accomodation in the frontend**. The size paramters like xl, xxl are booleans and they tell if a particular size is available for sale. Max_amount is the max amount for fund raisers. Some goodies have a limit to them. If 'limit' is 0 (default) then there is no limit to the quantity that can be purchases by a user. 'host_id' is also provided to display the goodie info to the hoster of the goodie (See *GOODIE GET SALE INFO METHOD*). 

   - END POINT : API_PATH/goodies
   - METHOD : GET
   - PARAMS : (No params required)
   - RESPONSE : 
   ```
    Status : 201
   Body : [{"g_id":1000,"g_type":0,"g_name":"TEDX TSHIRT","g_img":"default.png","g_host":"TEDX","g_price":150,"min_amount":1,"max_amount":2000,"sizes":    {"xs":0,"s":0,"m":0,"l":0,"xl":0,"xxl":0,"xxxl":0},"host_id":"f20191322","limit":0}]
   ```
                       
- **GOODIES BUY METHOD** :  For purchasing a goodie. Since purchasing a goodie leads to deduction from other advances, we decided to make this process secure by asking for the password of the user for every purchase. So instead of token the user has to be prompted for a password to confirm the sale and that is to be sent along with other parameters. In order provide another layer of security and tranparency a mail is sent to the user on every successful purchase with the relevant details. 
   - END POINT : API_PATH/goodies
   - METHOD : POST
   - PARAMS : 'uid', 'password', 'g_id', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'net_quantity', 'total_amount' (For type 1 and type 2 goodies send the size paramters as 0). 
   - RESPONSE : 
   ```
    Status : 201
    Body : {}
   ```
                       
- **GOODIES GET SALE INFO** :  For providing the hoster of the goodie infomation regarding the sales. In the frontend check if the current logged in user matches the host_id of the goodie. If so then send a GET request using this method to get the satistics about the sales.  
   - END POINT : API_PATH/goodies/info
   - METHOD : GET
   - PARAMS : 'uid', 'token', 'g_id'
   - RESPONSE : 
   ```
    Status : 201
    Body : {"xs":0,"s":0,"m":0,"l":0,"xl":1,"xxl":1,"xxxl":0,"net_quantity":2,"total_amount":200}
   ```
                       
## MCN :                        
- **MCN APPLY METHOD** : For apply for mcn. Everytime a new application is sent the previous application is updated. 
   - END POINT : API_PATH/mcn
   - METHOD : POST with multipart/form-data header
   - PARAMS : fsalary, msalary, categ and upload key with the zip file (max size 1 mb and check for file format in the frontend as well)
   - RESPONSE : 
   ```
     Status : 201
     Body : {}
   ```
                       
- **MCN PORTAL OPEN/CLOSE** : To find if mcn portal is open our closed.
   - END POINT : API_PATH/mcn/portal
   - METHOD : GET
   - PARAMS : 
   - RESPONSE : 
   ```
     Status : 200 if open 404 if closed
     Body : {err : true/false, msg: "MCN portal is closed (for status 404)", data{}}
   ```
   
   - **MCN GET APPLICATION** : To get the current application details.
   - END POINT : API_PATH/mcn/get
   - METHOD : GET
   - PARAMS : 
   - RESPONSE : 
   ```
     Status : 200 if open 404 if closed
     Body : {
     "uid": "f20191322",
            "name": "PRATHMESH SRIVASTAVA",
            "fsalary": 100,
            "msalary": 100,
            "categ": "General",
            "status": 0,
            "remark": "NA",
            "upload": [A LINK TO DOWNLOAD ZIP FILE]
            }
  ```

  - **MCN DELETE APPLICATION** : To delete the current application.
   - END POINT : API_PATH/mcn/delete
   - METHOD : POST
   - PARAMS : 
   - RESPONSE : 
   ```
     Status : 201 if deleted
  ```
                       
## Deductions : 
- **DEDUCTIONS GET METHOD** : To get all the deductions of a user.  
   - END POINT : API_PATH/deductions
   - METHOD : GET
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token received using auth method)
   - RESPONSE : 
   ```
    [
     {
        "transaction_id": 5,
        "g_id": 1,
        "g_name": "Comedy Nights",
        "g_price": 200,
        "xs": 0,
        "s": 0,
        "m": 0,
        "l": 0,
        "xl": 0,
        "xxl": 0,
        "total_amount": 400,
        "net_quantity": 2,
        "time": "1592748888111",
        "isCancellable": 1
     },
     {
        "transaction_id": 6,
        "g_id": 2,
        "g_name": "Nirmaan Fund Raiser",
        "g_price": 0,
        "xs": 0,
        "s": 0,
        "m": 0,
        "l": 0,
        "xl": 0,
        "xxl": 0,
        "total_amount": 0,
        "net_quantity": 1,
        "time": "1592748896441",
        "isCancellable": 1
     }]
    ```
   NOTE : isCancellable == 1 means that the goodies is currently hosted and hence this deduction can be cancelled. For cancelling the deduction see Deduction cancel method. A 0 means that this deduction can't be cancelled. 
     
- **DEDUCTION CANCEL METHOD** : For cancelling a deduction. Keep in mind that a deduction can't be cancelled after the goodies is taken off the portal. For that purpose we have a isCancellable paramter along with all the deductions. If its value is 1 then only the deduction can be cancelled. 
   - END POINT : API_PATH/deductions/cancel
   - METHOD : POST
   - PARAMS : 'uid' (f20xxxxxx), 'token' (64 character token received using auth method), 'transaction_id'
   - RESPONSE : 
   ```
   Status : 201
   Body : {}
   ```
                      
## Connect : 
- **Responsiblity Bearers** : To get the info of all the responsiblity beares.  
   - END POINT : API_PATH/con/resb
   - METHOD : GET
   - PARAMS : 
   - RESPONSE : 
```   
Status : 200,
Body :  {
  "swd": [
    {
      "uid": "f20181095",
      "name": "Shraddha",
      "phone": null,
      "body": "swd",
      "designation": "Coordinator Sem 1"
    },
    {
      "uid": "f20180862",
      "name": "Param",
      "phone": null,
      "body": "swd",
      "designation": "Coordinator Sem 2"
    },
    {
      "uid": "f20191204",
      "name": "Aryan",
      "phone": "8007187941",
      "body": "swd",
      "designation": "Teach Team Member "
    },
    {
      "uid": "f20191322",
      "name": "Prathmesh Srivastava",
      "phone": "6393418824",
      "body": "swd",
      "designation": "Tech Team Member"
    }
  ],
  "suc": [],
  "crc": [],
  "smc": [],
  "ec": []
}
```   

## Documents : 
- **List of available documents** : To get the list of all the documents up for generation.  
   - END POINT : API_PATH/doc/list
   - METHOD : GET
   - PARAMS : 
   - RESPONSE : 
```   
Status : 200,
Body : [
  {
    "name": "Bonafide Certificate",
    "key": "bon"
  },
  {
    "name": "No Objection Certificate",
    "key": "noc"
  },
  {
    "name": "Vacation Letter",
    "key": "vac"
  },
  {
    "name": "Good Character Certificate",
    "key": "gcc"
  },
  {
    "name": "Medical Insurance Form",
    "key": "medicform"
  }
]
```   

- **Download a document** : To download a document you'll need the key for each document its basically a shorten identifier for that document for eg : 'bon', 'noc', 'gcc' etc.  
   - END POINT : API_PATH/doc
   - METHOD : GET
   - PARAMS : uid, token, key
   - RESPONSE : 
```   
Status : 201,
Body : [Actual document can be downlaoded with this link]
```   
 
## Outstation : 
- **GET OUTSTATIONS** : Get all outstations of the user.
   - END POINT : API_PATH/outstation/
   - METHOD : GET
   - PARAMS : uid, token
   - RESPONSE : 
```   
Status : 200,
Body : [
    {
        "outstation_id": 1,
        "uid": "f20191322",
        "from": "2020-07-28",
        "to": "2020-07-30",
        "location": "Lucknow, UP",
        "reason": "Fun",
        "duration": 2,
        "approved": 0
    }
]
```   
NOTE THAT approved === 0 means that that outstation hasn't been approved till now. approved === -1 means the outstation is denied for some reason. approved === 1 means the outstation is approved!

- **APPLY FOR OUTSTATION** : To apply for an outstation.  
   - END POINT : API_PATH/outstation
   - METHOD : POST
   - PARAMS : uid, token, from, to, reason, location
   - RESPONSE : 
   In case of all good : 
```   
Status : 201,
Body : 
```   
  In case of BAD REQUEST (Just like mess grace):
```   
Status : 400,
Body : {
    "error": "Applying too early for outstation"
}
```     

- **CANCEL AN OUTSTATION** : To cancel an outstation
   - END POINT : API_PATH/outstation/cancel
   - METHOD : POST
   - PARAMS : uid, outstation_id
   - RESPONSE : 
```   
Status : 201,
Body : 
```       
   
## Notifications
   
   - **REGISTER ANDROID/IOS DEVICE**: Register the user's device for receiving push notifications.
     - END POINT: API_PATH/notifications/register  
     - METHOD: POST  
     - PARAMS: uid, token, device_token, platform (platform should be either `android` or `ios`)  
     - RESPONSE: 
      ```   
      Status: 200,
      Body: 
      {
       "error": false,
       message: "Successfully registered device"
      }
     ```   
  
  ## Counsellor Booking
   
   - **GET LIST OF AVAILABLE SLOTS**: To get a list of all available slots in a week duration.
     - END POINT: API_PATH/counsellor 
     - METHOD: GET
     - PARAMS: 
     - RESPONSE: 
      ```   
      Status: 200,
      data: [
        {
            "date": "2020-09-26",
            "slot": 9
        },
        {
            "date": "2020-09-26",
            "slot": 10
        },
        {
            "date": "2020-09-27",
            "slot": 9
        },
        {
            "date": "2020-09-27",
            "slot": 10
        },
        {
            "date": "2020-09-27",
            "slot": 11
        },
        {
            "date": "2020-09-27",
            "slot": 12
        },
        {
            "date": "2020-09-28",
            "slot": 9
        },
        {
            "date": "2020-09-28",
            "slot": 10
        },
        {
            "date": "2020-09-28",
            "slot": 12
        },
        {
            "date": "2020-09-28",
            "slot": 14
        },
        {
            "date": "2020-09-28",
            "slot": 15
        },
        {
            "date": "2020-09-29",
            "slot": 9
        },
        {
            "date": "2020-09-29",
            "slot": 10
        },
        {
            "date": "2020-09-30",
            "slot": 9
        },
        {
            "date": "2020-09-30",
            "slot": 10
        },
        {
            "date": "2020-10-01",
            "slot": 9
        },
        {
            "date": "2020-10-01",
            "slot": 10
        },
        {
            "date": "2020-10-01",
            "slot": 13
        },
        {
            "date": "2020-10-02",
            "slot": 9
        },
        {
            "date": "2020-10-02",
            "slot": 10
        }
     ]  
     ```   
  
- **BOOK A SLOT**: To book a slot.
     - END POINT: API_PATH/counsellor 
     - METHOD: POST
     - PARAMS: date, slot
     - RESPONSE: 
    ```
     Status : 201
     body : {
       "err": false,
       "msg": "Counsellor slot booked successfully",
       "data": {}
     }
    ```

- **GET USER BOOKINGS**: To get all the bookings of the user.
     - END POINT: API_PATH/counsellor/bookings
     - METHOD: GET
     - PARAMS: 
     - RESPONSE: 
     ```
     Status : 201
     body : {
    "err": false,
    "msg": "",
    "data": [
        {
            "booking_id": 22,
            "uid": "f20191322",
            "date": "2020-09-26",
            "slot": 9,
            "booking_time": "1600974340100"
        },
        {
            "booking_id": 24,
            "uid": "f20191322",
            "date": "2020-09-26",
            "slot": 10,
            "booking_time": "1600976682112"
        }
       ]
    }
    ```

- **DELETE A BOOKING**: To delete a booking.
     - END POINT: API_PATH/counsellor/delete
     - METHOD: POST
     - PARAMS: booking_id
     - RESPONSE: 
      ```   
      Status : 201
      body : {
        "err": false,
        "msg": "Counsellor slot booked successfully",
        "data": {}
      }
     ```   

## LL
   
- **MENTOR**: Getting mentor details
   - END POINT: API_PATH/ll/mentor/ 
   - METHOD: GET
   - PARAMS: Token in auth header  
   - RESPONSE: 
    ```   
    Status: 200,
    Body: 
    {
      err: false,
      msg: '',
      data: {"err":false,"msg":"","data":[{"uid":"f20191322","branch":"B.E. Computer Science","prof_name":"B.E. Computer Science","prof_mail":"Aruna Malapati"}]}
    }
   ```
- **INSURANCE**: Medical insurance
   - END POINT: API_PATH/ll/insurance
   - METHOD: GET
   - PARAMS: Token in auth header  
   - RESPONSE: 
    ```   
     Status: 200,
     Body: 
     {
       err: false,
       msg: '',
       data: {}
     }      
    ```    
## FAQ
- - **FAQS**: Frequently asked questions
   - END POINT: API_PATH/faq
   - METHOD: GET
   - PARAMS: Token lite
   - RESPONSE: 
    ```   
     Status: 200,
     Body: 
     {
       err: false,
       msg: '',
       data: [FAQS]
     }      
    ``` 
    
## OFFICE
- - **Office contacts**: 
   - END POINT: API_PATH/faq
   - METHOD: GET
   - PARAMS: Token lite
   - RESPONSE: 
    ```   
     Status: 200,
     Body: 
     {
       err: false,
       msg: '',
       data: [FAQS]
     }      
    ```
    
## NOTICES
 - **Fetch Feed**: Get a feed of notices. It uses pagination, you need to provide a start index and a count of notices to fetch. 
    - END POINT: API_PATH/notices/feed
    - METHOD: GET
    - PARAMS: start (int), limit (int)
    - RESPONSE: 
     ```   
     Status: 200,
     Body: {
     "err": false,
     "msg": "",
     "data": [
       {
         "notice_id": 2,
         "pid": "swd",
         "title": "MCN 2020-21 I-SEM (2016 Batch)",
         "body": "The list of awardees for Merit and MCN Scholarships for SEM-I 2020-21 for 2016 Batch has been released. Click on the below button to view/download.",
         "event": 0,
         "image": "",
         "attachment": "https://swdbphc.ml/public_storage/notices/2016.pdf",
         "time": 1619674187,
         "meet_link": "",
         "event_time": 0,
         "name": "SWD",
         "pimage": "0"
       },
       {
         "notice_id": 3,
         "pid": "swd",
         "title": "MCN 2020-21 I-SEM (2017 Batch)",
         "body": "The list of awardees for Merit and MCN Scholarships for SEM-I 2020-21 for 2017 Batch has been released. Click on the below button to view/download.",
         "event": 0,
         "image": "",
         "attachment": "https://swdbphc.ml/public_storage/notices/2017.pdf",
         "time": 1619674187,
         "meet_link": "",
         "event_time": 0,
         "name": "SWD",
         "pimage": "0"
       },
       {
         "notice_id": 4,
         "pid": "swd",
         "title": "MCN 2020-21 I-SEM (2018 Batch)",
         "body": "The list of awardees for Merit and MCN Scholarships for SEM-I 2020-21 for 2018 Batch has been released. Click on the below button to view/download.",
         "event": 0,
         "image": "",
         "attachment": "https://swdbphc.ml/public_storage/notices/2018.pdf",
         "time": 1619674187,
         "meet_link": "",
         "event_time": 0,
         "name": "SWD",
         "pimage": "0"
       },
       {
         "notice_id": 5,
         "pid": "swd",
         "title": "MCN 2020-21 I-SEM (2019 Batch)",
         "body": "The list of awardees for Merit and MCN Scholarships for SEM-I 2020-21 for 2019 Batch has been released. Click on the below button to view/download.",
         "event": 0,
         "image": "",
         "attachment": "https://swdbphc.ml/public_storage/notices/2019.pdf",
         "time": 1619674187,
         "meet_link": "",
         "event_time": 0,
         "name": "SWD",
         "pimage": "0"
       },
       {
         "notice_id": 6,
         "pid": "swd",
         "title": "MCN 2020-21 I-SEM (2020 Batch)",
         "body": "The list of awardees for Merit and MCN Scholarships for SEM-I 2020-21 for 2020 Batch has been released. Click on the below button to view/download.",
         "event": 0,
         "image": "",
         "attachment": "https://swdbphc.ml/public_storage/notices/2020.pdf",
         "time": 1619674187,
         "meet_link": "",
         "event_time": 0,
         "name": "SWD",
         "pimage": "0"
       }
     ]
   }
    ```  
  - **Filter Feed by Token**: Get feed items based on tokens. Accepts pagination parameters (start, limit) and a token based on which the notices are filtered.
    - END POINT: API_PATH/notices/feed/filter/token
    - METHOD: GET
    - PARAMS: start (int), limit (int), token (string)
    - RESPONSE: 
      ```   
      Status: 200,
      Body: (Same format as for notices feed)
     ```
     
  - **Filter Feed by Date**: Get feed items based on dates. Accepts pagination parameters (start, limit) and a date range (start_date, end_date).
    - END POINT: API_PATH/notices/feed/filter/date
    - METHOD: GET
    - PARAMS: start (int), limit (int), start_date, end_date
    - RESPONSE: 
      ```   
      Status: 200,
      Body: (Same format as for notices feed)
     ```     
