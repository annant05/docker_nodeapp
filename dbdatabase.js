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


        return new Promise((resolve, reject) => {
            try {
                this.documentClient.scan(params, (err, data) => {
                    if (err) throw err;

                    if (data.Count !== 0)
                        resolve({ status: true, data: data.Items[0] });
                    else
                        resolve({ status: false, data: data });
           });
            } catch (err) {
                console.log("\nError in signup:  " + err);
            }

        });
    }

}
module.exports.Dynamodb = Dynamodb;