"use strict";
const db = new require("dbdatabase").Dynamodb("nodeusers");
import db from "d";
const main = async () => {
    // const db = new Dynamodb("nodeusers");
    let responses = await db
        .signup("annant1", "pass1")
        .then(data => {return data; })
        .catch(err => {return err;});

    if (responses.status) console.log("res  passed : ", responses);
    else console.log("res  failed : ", responses);

    // const res = await db.login("annant", "pass1")
    //     .then(data => { return data; })
    //     .catch(err => { return err; });;

    // console.log("Res : ", res);

};
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
