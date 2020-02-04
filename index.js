"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

class MyDbClass {
    constructor(TABLE_NAME) {
        this.TABLE_NAME = TABLE_NAME;
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    signup(email, password) {
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
                    if (err) {
                        console.log(err);
                        reject({ status: false });
                    }
                    else if (data) resolve({ status: true });
                });
            } catch (err) {
                console.log("\nError in signup:  " + err);
            }
        });
    }

    login(email, password) {

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


        return new Promise((resolve, reject) => {
            try {
                this.documentClient.scan(params, (err, data) => {
                    if (err) throw err;
                    // data.Count !== 0 &&
                    if (data.Count === 1)
                        resolve({ status: true });
                    else
                        resolve({ status: false });
                });
            } catch (err) {
                console.log("\nError in signup:  " + err);
            }

        });
    }

}

exports.handler =  async (event, context) => {
    // TODO implement
    const db = new MyDbClass("nodeusers");

    const response = {
        statusCode: 200,
        body: null,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    };

    let loginJsonObject = JSON.parse(event.body).loginJsonObject;
    console.log(loginJsonObject);
    // const loginJsonObject={
    //     email:"myemail",
    //     password:"mypass"
    // }

    let email = loginJsonObject.email;
    let password = loginJsonObject.password;

    switch (event.path) {
        case "/signup":
            {
                try {
                    console.log("start try block");
                    let result = await db
                        .signup(email, password)
                        .then(data => { return data; })
                        .catch(err => { return err; });

                    if (result.status)
                        response.body = JSON.stringify({ userExists: true });
                    else
                        response.body = JSON.stringify({ userExists: false });

                } catch (e) {
                    console.log("exception e : " + e);
                    response.body = JSON.stringify({ userExists: false });
                }
            }
            break;

        case "/login":
            {
                try {
                    const result = await db
                        .login(email, password)
                        .then(data => { return data; })
                        .catch(err => { return err; });;

                    if (result.status)
                        response.body = JSON.stringify({ userExists: true });
                    else
                        response.body = JSON.stringify({ userExists: false });
                }
                catch (e) {
                    console.log("exception e : " + e);
                    response.body = JSON.stringify({ userExists: false });
                }

            }
            break;

        default:
        // code
    }
    console.log("lambda function executed succesfully");
    return response;
};
// const event= {
//     path:"/signup"

// }
// lambda(event,null);