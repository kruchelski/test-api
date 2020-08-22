// imports
const fileFacade = require('../facade/FileFacade');

// constants
const firstAccount = {
  destination: {
    id: '300',
    balance: 0
  }
}

// global vars
var accountsArray = [];

// internal functions

/**
 * Initialize account with number 300
 */
async function initFirstAccount() {
  // Create an array with the first account
  let initialData = [];
  initialData.push(firstAccount);
  // Write the first account into the file
  return await fileFacade.writeFile(initialData);
}

/**
 * Load the accountsArray
 */
async function loadAccountsArray() {
  // Read the file
  let readResp = await fileFacade.readFile();

  // Associates the data to the accountsArray
  if (readResp.status === 'ok') {
    accountsArray = JSON.parse(readResp.detail);
    return ({status: 'ok', detail: null});
  }
}


// exports
/**
 * Resets the storage, initialize an account with number 300 and 
 * loads the var accountsArray
 * @param {*} ___ Request object (not used)
 * @param {*} res Response object
 */
exports.reset = async function (___, res) {

  try {
    // Resets the storage media for the accounts
    let resp = await fileFacade.resetFile();

    // Write the first account to the array
    if (resp.status === 'ok') {
      resp = await initFirstAccount();
    }

    // Load the accountsArray
    if (resp.status === 'ok') {
      resp = await loadAccountsArray();
    }

    // Return message to client
    if (resp.status === 'ok') {
      res.status(200).send('OK');
    }

  } catch (err) {
    console.log(err);
    // Sends the error message to the client
    res.status(500).send('An unexpect error happened :(');
  }
}

/**
 * Test function to check the status of the accountsArray
 * @param {*} ___ 
 * @param {*} res 
 */
exports.test = function (___, res) {
  res.status(200).send(accountsArray);
}


