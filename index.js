"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

class Dynamodb {
    constructor(TABLE_NAME) {
        this.TABLE_NAME = TABLE_NAME;
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async signup(email, password) {
        const epoch = `${Math.round(new Date().getTime() / 1000).toString()}`;
        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                time_of_insertion: epoch,
                email: email,
                password: password
            }
        };

        return new Promise((resolve, reject) => {
            try {
                this.documentClient.put(params, (err, data) => {
                    if (err) reject({ status: false, err: err });
                    else if (data) resolve({ status: true, data: data });
                });
            } catch (err) {
                console.log("\nError in signup:  " + err);
            }
        });
    }

    async login(email, password) {

        const params = {
            TableName: this.TABLE_NAME,
            FilterExpression: '#str_email = :val_email and #str_password = :val_password',
            ExpressionAttributeNames: {
                "#str_email": "email",
                "#str_password": "password"
            },
            ExpressionAttributeValues: {
                ':val_email': email,
                ':val_password': password
            },
            ProjectionExpression: "email"
        };


        // return new Promise((resolve, reject) => {
        //     try {
        //         this.documentClient.put(params, (err, data) => {
        //             if (err) reject({ status: false, err: err });
        //             else if (data) resolve({ status: true, data: data });
        //         });
        //     } catch (err) {
        //         console.log("\nError in signup:  " + err);
        //     }
        // });


        return new Promise((resolve, reject) => {
            try {
                this.documentClient.scan(params, (err, data) => {
                    if (err) throw err;

                    if (data.Count !== 0)
                        resolve({ status: true, data: data.Items[0] });
                    else
                        resolve({ status: false, data: data });


                    // if (err) {
                    //     console.log("\nThere was some error ", err, err.stack);
                    // }// an error occurred
                    // else {
                    //     console.log(data);
                    //     console.log("\nUser recieved ", data.Count);
                    //     if (err) 

                    // }
                    // this.documentClient.put(params, (err, data) => {
                    //     if (err) reject({ status: false, err: err });node
                    //     else if (data) resolve({ status: true, data: data });
                    // });
                });
            } catch (err) {
                console.log("\nError in signup:  " + err);
            }

        });
    }
    // const epoch = `${Math.round(new Date().getTime() / 1000).toString()}`;
    // const params = {
    //     TableName: this.TABLE_NAME,
    //     Item: {
    //         time_of_insertion: epoch,
    //         email: email + epoch,
    //         password: password
    //     }
    // };

    // return new Promise((resolve, reject) => {
    //     try {
    //         this.documentClient.put(params, (err, data) => {
    //             if (err) reject({ status: false, err: err });
    //             else if (data) resolve({ status: true, data: data });
    //         });
    //     } catch (err) {
    //         console.log("\nError in signup:  " + err);
    //     }
    // });


}

const main = async () => {
    const db = new Dynamodb("nodeusers");
    let responses = await db
        .signup("annant1", "pass1")
        .then(data => {return data; })
        .catch(err => {return err;});

    if (responses.status) console.log("res  passed : ", responses);
    else console.log("res  failed : ", responses);

    const res = await db.login("annant", "pass1")
        .then(data => { return data; })
        .catch(err => { return err; });;

    console.log("Res : ", res);

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
