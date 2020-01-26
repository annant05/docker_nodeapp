"use strict";
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });

// const dbconnection = require('serverless-mysql')({
//     config: {
//         host: "ip-172-31-13-87.ec2.internal",
//         user: "annant",
//         password: "12345678",
//         database: "userdb"
//     }
// });

class Dynamodb {
    // TABLE_NAME= "";
    // documentClient = ""   ;
    constructor(TABLE_NAME) {
        this.TABLE_NAME = TABLE_NAME;
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async signup(email, password) {

        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                time_of_insertion: `${(Math.round((new Date()).getTime() / 1000)).toString()}`,
                email: email + `${(Math.round((new Date()).getTime() / 1000)).toString()}`,
                password: password
            }
        }
        try {
            
            // the issue is here. It return is not sending the json object in resolve and reject functions.
 
            return await this.documentClient.put(params, (err, data) => {
                return new Promise((resolve, reject) => {
                    if (data)
                        resolve({data:{status:true,data:data}});
                    else if (err)
                        reject({data:{status:false,err:err}});
                    else 
                        throw err;
                });
            });
            // console.log(result);
        } catch (err) {
            console.log("\nError in signup:  " + err);
        }

    }

}

const main = async () => {
    const db = new Dynamodb("nodeusers");
            // or either i don't know how to extract json from a promise response her
    let resposes = await db.signup("annant1", "pass1")
        .then((data) => { return (data.json()); })
        .catch((err) => { return (err.json()) });
    console.log("res", resposes);



}
main();

// exports.handler = async(event, context) => {
//     // TODO implement


//     const response = {
//         statusCode: 200,
//         body: null,
//          headers: {
//         "Access-Control-Allow-Origin": "*"
//          }
//     };

//     let loginJsonObject = JSON.parse(event.body).loginJsonObject;
//     console.log(loginJsonObject);

//     switch (event.path) {
//         case "/signup":
//             {
//                 let email = loginJsonObject.email;
//                 let password = loginJsonObject.password;
//                 try {
//                     console.log("start try block");
//                     let results = await dbconnection.query(`insert into users values("${email}" ,"${password}")`);
//                     console.log(results);
//                     console.log("end try block");
//                     response.body = JSON.stringify({ userExists: true });
//                 }
//                 catch (e) {
//                     console.log("exception e : " + e);
//                     response.body = JSON.stringify({ userExists: false });
//                 }
//             }
//             break;

//         case "/login":
//             {
//                 let email = loginJsonObject.email;
//                 let password = loginJsonObject.password;
//                 try {
//                     let results = await dbconnection.query(
//                         `SELECT count(*) from users WHERE email="${email}" AND password="${password}"`);
//                     if (results[0]["count(*)"]) response.body = JSON.stringify({ userExists: true });
//                     else response.body = JSON.stringify({ userExists: false });
//                 }
//                 catch (e) {
//                     console.log("exception e : " + e);
//                     response.body = JSON.stringify({ userExists: false });
//                 }

//             }
//             break;

//         default:
//             // code
//     }

//     await dbconnection.end();
//     return response;
// };
