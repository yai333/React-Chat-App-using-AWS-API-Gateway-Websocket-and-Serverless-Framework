Realtime chat web app using React, AWS API Gateway Websockets, Dynamodb and custom Cognito authorizer.
https://medium.com/neami-apps/how-to-build-a-react-chat-app-with-aws-api-gateway-websockets-and-cognito-custom-authorizer-6f84f2da47ec

## Project Structure

```bash
── /backend/            # Api Gateway Websockets and Lambda functions
── /frontend/           # Frontend React web app
```

## Stack

- React 16.8+
- Serverless 1.38+
- Node.js 8.10

## Create AWS Cognito User Pool

https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html

Once User Pool created, Replace all <strong>APP_CLIENT_ID</strong> and <strong>USER_POOL_ID</strong> to your created IDs

## Deploy Backend

```
cd backend
sls deploy
cd ..
```

## Run React App

```
cd frontend
npm install
npm start
```
