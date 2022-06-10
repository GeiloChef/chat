const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = async function (password){
    let hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

/**
 * 
 * @param {String} password 
 * @param {String} hash 
 * @returns true / false
 */
async function comparePassword(password, hash){
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hash, function(err, res) {
            if (err) {
                 reject(err);
            } else {
                 resolve(res);
            }
        });
    });
}


module.exports = {
    hashPassword,
    comparePassword,
}