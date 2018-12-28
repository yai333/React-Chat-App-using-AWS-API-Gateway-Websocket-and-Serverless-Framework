Realtime chat web app using React, AWS API Gateway Websockets, Dynamodb and custom Cognito authorizer.

## Project Structure

```bash
── /backend/            # Api Gateway Websockets and Lambda functions
── /auth/               # Custom Authorizer for Api Gateway Websockets $connect route
── /frontend/           # Frontend React web app
```

## Stack

- React 6.7.0-alpha.2
- Serverless 1.35.1
- Node.js 8.10

## Create AWS Cognito User Pool

https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-create-user-pool.html

Once User Pool created, Replace all APP_CLIENT_ID and USER_POOL_ID to your created IDs

## Deploy Backend

```
cd backend
sls deploy
cd ..
```

## Deploy Custom Authorizer Lambda Function

```
cd auth
sls deploy
cd ..
```

## Configure Lambda Authorizer Using the API Gateway Console

- Go to AWS console->API Gateway->serverless-chat->Authorizers
- Name: auth
- Lambda Function: serverless-chat-auth
- Identity Sources: Query String + token

### Add Lambda Authorizer to \$connect route

- Go to Routes ->\$connect->Route Request->Authorization, select auth
- Actions-> Deploy API->Deployment stage, select dev

## Run React App

```
cd frontend
npm install
npm start
```
