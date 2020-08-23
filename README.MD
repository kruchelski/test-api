# BANK API
---
## Overview
This is a simple bank API for testing purposes. It can handle a few operation and, to this moment, it does not handles data persistance.

## Routes
`POST /reset`- Resets the storage system (it doesn't matter the body of this request)
`GET /test` - Return the actual list of accounts in the storage system
`GET /balance` - Return the balance of an account based on the query parameters passed in the url. It doesn't find, a 404 response will be sent. The query parameters must be passed like the following example:
- `/balance?account_id=100`
`POST /event` - This endpoint can handle three operations:
- `deposit` - Deposit an amount in the destination account. If the account does not exist, it will be created
- `withdraw` - Withdraw an amount from the origin account. If the account does not exist, a 404 response will be sent to the client
- `transfer` - Transfer an amount from the origin account to the destination account. If the origin or destinatiou accounts doesn't exists, a 404 response will be sent.

The requests sent to the `/event` endpoint must be like the following example:

- To deposit:
`{"type":"deposit", "destination":"100", "amount":10}`   

- To withdraw:
`{"type":"withdraw", "origin":"100", "amount":10}`    

- To transfer:
`{"type":"transfer", "origin":"100", "amount":10, "destination":"300"}`   

## Running in localhost
Execute the following command in the root folder of the application
`node index.js`

The make the requests to the URL: `localhost:3000`
- For example: `localhost:3000/balance?account_id=100`