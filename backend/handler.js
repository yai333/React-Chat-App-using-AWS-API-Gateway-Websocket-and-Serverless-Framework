"use strict";

const AWS = require("aws-sdk");
const Bluebird = require("bluebird");
AWS.config.update({ region: process.env.AWS_REGION });
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
AWS.config.setPromisesDependency(Bluebird);
require("aws-sdk/clients/apigatewaymanagementapi");

const successfullResponse = {
  statusCode: 200,
  body: "Connected"
};

module.exports.connectionManager = (event, context, callback) => {
  if (event.requestContext.eventType === "CONNECT") {
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        callback(null, JSON.stringify(err));
      });
  } else if (event.requestContext.eventType === "DISCONNECT") {
    deleteConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        callback(null, {
          statusCode: 500,
          body: "Failed to connect: " + JSON.stringify(err)
        });
      });
  }
};

module.exports.defaultMessage = (event, context, callback) => {
  callback(null);
};

module.exports.sendMessage = async (event, context, callback) => {
  let connectionData;
  try {
    connectionData = await DDB.scan({
      TableName: process.env.CHATCONNECTION_TABLE,
      ProjectionExpression: "connectionId"
    }).promise();
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }
  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      return await send(event, connectionId.S);
    } catch (err) {
      if (err.statusCode === 410) {
        return await deleteConnection(connectionId.S);
      }
      console.log(JSON.stringify(err));
      throw err;
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (err) {
    console.log(err);
    callback(null, JSON.stringify(err));
  }
  callback(null, successfullResponse);
};

const send = (event, connectionId) => {
  const postData = JSON.parse(event.body).data;
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
  });
  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: postData })
    .promise();
};

const addConnection = connectionId => {
  const putParams = {
    TableName: process.env.CHATCONNECTION_TABLE,
    Item: {
      connectionId: { S: connectionId }
    }
  };

  return DDB.putItem(putParams).promise();
};

const deleteConnection = connectionId => {
  const deleteParams = {
    TableName: process.env.CHATCONNECTION_TABLE,
    Key: {
      connectionId: { S: connectionId }
    }
  };

  return DDB.deleteItem(deleteParams).promise();
};
