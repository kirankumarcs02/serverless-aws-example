const AWS = require('aws-sdk');

// for local testing
// AWS.config.update({
//     accessKeyId: 'accessKeyId',
//     secretAccessKey: 'secretAccessKey',
//     region: 'us-east-1',
//     endpoint: 'http://localhost:8000'
// });
// const BSON = require('bson');

AWS.config.update({
        region: process.env.REGION});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    console.log('data', data);
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            aadharNumber: data.aadharNumber,
            name: data.name,
            phoneNumber: data.phoneNumber,
            address: data.address
        },
    };
    dynamoDb.put(params).promise()
        .then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(params.Item),
            };
            callback(null, response);
        })
        .catch((error) => {
            callback(null, {
                statusCode: 501,
                body: JSON.stringify({
                    message: 'Couldn\'t create the user info.',
                    error: error
                }),

            });
        })
};


module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            aadharNumber: event.pathParameters.aadharNumber
        },
    };

    dynamoDb.get(params).promise()
        .then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(result.Item),
            };
            callback(null, response);
        }).catch((error) => {
        callback(null, {
            statusCode: 501,
            body: JSON.stringify({
                message: 'Couldn\'t read the user info.',
                error: error
            }),
        });
    })

};

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.aadharNumber,
        },
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':phoneNumber': data.phoneNumber,
            ':address': data.address,
        },
        UpdateExpression: 'SET #name = :name, phoneNumber = :phoneNumber, address = :address',
        ReturnValues: 'ALL_NEW',
    };
    dynamoDb.update(params).promise()
        .then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(result.Attributes),
            };
            callback(null, response);
        })
        .catch((error) => {
            callback(null, {
                statusCode: 501,
                body: 'Couldn\'t  able to update the user info.',
                error: error
            });
        })
};

module.exports.delete = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            aadharNumber: event.pathParameters.aadharNumber,
        },
    };
    dynamoDb.delete(params).promise()
        .then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({"message": "Deleted successfully"}),
            };
            callback(null, response)
        }).catch((error) => {
        callback(null, {
            statusCode: 501,
            body: JSON.stringify({
                message: 'Couldn\'t delete the user info.',
                error: error
            }),
        });
    })

};


// const Long = BSON.Long;
//
// const doc = {
//     id : 1,
//     name:"checking",
//     phoneNumber: 1234578,
//     address: {
//         road: 1,
//         cross:1
//     }
// };
//
// // Serialize a document
// const data = BSON.serialize(doc);
// console.log('data:', data.toString('utf8'));
//
// // Deserialize the resulting Buffer
// const doc_2 = BSON.deserialize(data);
// console.log('doc_2:', doc_2);

// input = {
//     "aadharNumber": "123-456-789",
//     "name": "Kiran",
//     "address": {
//         city: "Bangalore",
//         state: "Karnataka"
//     }
// }