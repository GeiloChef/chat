const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const handler = require('../handler');
const authHandler = require('./authHandler');
const passwordHandler = require('./passwordHandler');

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 1000 * 60 * 60 * 24;

/**
 * Handles the login of a existing user
 * @param {*} req 
 * @param {*} res 
 */
async function login(req, res) {
    // get credentials from JSON Body
    const { email, password } = req.body;
    const userinfo = await authHandler.getPasswordHashFromDb(email);
    if (!userinfo) {
        res.send({
            "status": "error",
            "message": "The E-Mail and password could not be verified."
        }).end();
        return;
    }

    const comparePassword = await passwordHandler.comparePassword(password, userinfo.password);
    console.log(`Passwords are similar: ${comparePassword}`);
    if (!comparePassword) {
        res.send({
            "status": "error",
            "message": "The E-Mail and password could not be verified."
        }).end();
        return;
    }
    const uuid = userinfo.uuid;
    const token = jwt.sign({ uuid }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    console.log("token", token);
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    res.send({
        "status": "success",
        "username": userinfo.username,
        "uuid": userinfo.uuid,
        "token": token,
        "expires": jwtExpirySeconds,
    }).end();
}


/**
 * Handles the SignUp process of a user
 * @param {*} req 
 * @param {*} res 
 */
async function signup(req, res) {
    const { username, email, password } = req.body;
    let data = {
        'status': 'error',
        'message': 'This E-Mail already exists! Try to Login instead.'
    };
    // Check im mail exists already
    let userExists = await authHandler.userExists(email);
    console.log(`User Exists: ${userExists}`);
    if (!userExists) {
        let passwordHash = await passwordHandler.hashPassword(password);
        authHandler.insertNewUser({
            'username': username,
            'email': email,
            'passwordHash': passwordHash,
        });
        data = {
            'status': 'success',
            'message': 'User was created successfully. Login now!'
        };
    }
    res.send(data);
    res.end();
}

/**
 * Verifies a JWT token
 * @param {*} req 
 * @param {*} res 
 */
async function verifyToken(req, res) {
    const { token, uuid } = req.body;
    let data = {
        status: "error",
        message: "JWT could not be verified"
    };
    console.log(token);
    jwt.verify(token, 'my_secret_key', function (err, decoded) {
        if (err) {
            console.log("JWT could not be verified.")
        } else {
            if (decoded.uuid === uuid) {
                console.log("JWT was verified successfully.");
                console.log(decoded)
                data = {
                    status: "success",
                    message: "JWT was verified successfully"
                }
            } else {
                console.log("JWT could not verify user-uuid!")
                console.log(decoded)
            }
        }
    });
    res.send(data).end();
}


module.exports = {
    login,
    signup,
    verifyToken
}
