// all requires and declarations
const express = require("express"), app = express(); // creating express server
// const path = require('path');
const cors = require('cors')
const request = require("request");
const bodyParser = require("body-parser");  // used bodyParser to get data from all the field in form
// const cookieParser = require("cookie-parser");
require('log-timestamp');
const mysql = require('mysql');
const dbconnection = mysql.createConnection({
    host: '172.17.0.2',
    user: 'annant',
    password: '12345678',
    database: 'userdb'
});



// Declaration related to servers
const PORT = 8039 ;

request('http://169.254.169.254/latest/meta-data/public-ipv4', async function (error, response, body) {
    if (body !== undefined) console.log('\nserver started on ip:port : http://' + body + ":" + PORT);
    else console.log('\nserver started on ip:port : ' + 'http://localhost' + ":" + PORT);
});

app.listen(PORT, async function (err) {
    if (err) console.log("There was some problem in starting the server  : " + JSON.stringify(err, undefined, 2));
    else console.log('\nserver started on the port : ' + PORT);
});

//Main body of the js file
app.use(bodyParser.urlencoded({  // this is important
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());  // this is important caused a lot of time waste.


dbconnection.connect();





app.get('/', (req, res) => {
    console.log("\nGET: '/'  Web-Page");
    res.send("hello");
});

app.post('/login', async (req, res) => {
    console.log("\nPOST: '/login' = Received login data from AJAX call.");

    const loginJsonObject = req.body.loginJsonObject
    // const admissionJsonObject = req.body.new_admission_data;
    try {

        dbconnection.query(`SELECT count(*) from users WHERE email="${loginJsonObject.email}" AND password="${loginJsonObject.password}"`, function (error, results, fields) {
            if (error)  console.log(error);
            // console.log('result is: ', JSON.stringify(results[0]["count(*)"]));
            if (results[0]["count(*)"])
                res.send({ userExists: true });
            else
                res.send({ userExists: false });
        });

    } catch (e) {
        console.log("exception e : " + e);
        res.send({ success: false });
        
    }
});


app.post('/signup', async (req, res) => {
    console.log("\nPOST: '/signup' = Received login data from AJAX call.");

    const loginJsonObject = req.body.loginJsonObject
    // const admissionJsonObject = req.body.new_admission_data;
    try {

        dbconnection.query(`insert into users values("${loginJsonObject.email}" ,"${loginJsonObject.password}")`, function (error, results, fields) {
            if (error)  console.log(error);
            console.log(results);
            // console.log('result is: ', JSON.stringify(results[0]["count(*)"]));
            if (results)
                res.send({ userExists: true });
            else
                res.send({ userExists: false });
        });

    } catch (e) {
        console.log("exception e : " + e);
        res.send({ success: false });
    }
});

// url routing
console.log('\nServer-side code running');