// imports
const fs = require('fs');

// constants
const fileName = 'accounts.json';
const resetData = {};

/**
 * Reset the file (creating if not exists) inserting an empty array
 */
exports.resetFile = function() {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(resetData), 'utf8', (err) => {
      if (err) {
        console.log('Reset (write) fails!');
        console.log(err);
        reject({status: 'fail', detail: err});
      }
      resolve({status: 'ok', detail: null});
    })
  })
}

/**
 * Read the file and return it's content
 */
exports.readFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/${fileName}`, 'utf8', (err, data) => {
      if (err) {
        console.log('Read fails!');
        console.log(err);
        reject({status: 'fail', detail: err});
      }
      resolve({status: 'ok', detail: data});
    })
  })
}

/**
 * Write data to the file
 * @param {*} data Data to be saved to file
 */
exports.writeFile = function(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.log('Write fails!');
        console.log(err);
        reject({status: 'fail', detail: err});
      }
      resolve({status: 'ok', detail: null});
    })
  })
}