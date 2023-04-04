# Valere Margins Software Engineer Assessment

This project was made as an assessment task for a job position at Valere Margins

## Installation/Requirements

### Node

Run the following command to install the needed npm dependencies.

```node
npm install
```

### MongoDB

A running MongoDB instance is needed for the application to work

### Environment variables

A .env file needs to be created in the root of the project with the following variables:

- LOCAL_DB - URL of the MongoDB instance
- JWT_SECRET - string containing min. 32 characters used to sign JWT tokens
- MAILER_SECRET - string containing min. 32 characters used to encrypt verification tokens
- PORT - port on which server will be run
- GMAIL - email address (on Gmail service) from which emails will be sent
- GMAIL_PASS - password of given email (with Gmail only works with app passwords and 2FA enabled due to new regulations)

## Usage

Running the following command starts the server which can be accessed via browser from localhost:PORT

```node
node ./app.js
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
