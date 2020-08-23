// imports
const facade = require('../facade/Facade');

// constants
const firstAccount = {
  id: '300',
  balance: 0
}
const depositFields = ['type', 'destination', 'amount'];
const withdrawFields = ['type', 'origin', 'amount'];
const transferFields = ['type', 'origin', 'amount', 'destination'];


// internal functions
/**
 * Initialize account with number 300
 */
async function initFirstAccount() {
  // Creates the first account in storage
  return await facade.addAccount(firstAccount);
}

/**
 * Check the fields of the processed object
 * @param {*} data Processed object for the transaction
 */
function checkFields(data) {
  let check = true;
  let type = ''

  // If no data is passed, then the check fails
  if (!data) {
    check = false;
  }

  // If no type of transaction is passed, then the check fails
  if (!data.type) {
    check = false;
  } else {
    type = data.type;
    let fields = [];

    // Check which operation is being processed to load correct fields
    switch (type) {
      case 'deposit':
        fields = depositFields;
        break;
      case 'withdraw':
        fields = withdrawFields;
        break;
      case 'transfer':
        fields = transferFields;
        break;
      default:
        // If the type is not recognized, then the check fails;
        fields = null;
        check = false;
    }

    if (fields != null) {

      // Check the keys of the object passed for process
      const keys = Object.keys(data);
      for (field of fields) {
        if (!keys.includes(field)) {
          check = false;
          break;
        }
      }
    }
  }
  return check;
}

/**
 * Makes a deposit to an existing account or creates a new account
 * @param {*} res Response object
 * @param {*} param1 Deposit information (destination: id of the account and amount: value for deposit)
 */
async function doDeposit(res, { destination, amount }) {
  try {
    // If the deposit amount is less than or equal to zero, return error
    if (amount <= 0) {
      throw new Error('value');
    }

    // Find the account to deposit
    let accountResp = await facade.findById(destination)

    // If something goes wrong, throw error
    if (accountResp.status == 'fail') {
      throw new Error(accountResp.detail);
    }

    // If account not found, create new account
    if (accountResp.status === 'ok' && !accountResp.detail) {
      const newAccount = {
        id: destination,
        balance: amount
      }
      let newAccountResp = await facade.addAccount(newAccount);
      if (newAccountResp.status === 'fail') {
        throw new Error(newAccountResp.detail);
      }
      const responseObject = {
        destination: {
          id: newAccount.id,
          balance: newAccount.balance
        }
      }
      res.status(201).send(responseObject);
      return;
    }

    // If account found, update the value and update in the storage
    let account = accountResp.detail;
    account.balance += amount;
    let updateAccountResp = await facade.updateAccount(account);

    // If update fails, throw error
    if (updateAccountResp.status === 'fail') {
      throw new Error(updateAccountResp.detail);
    }

    // If update works, return response
    const responseObject = {
      destination: {
        id: account.id,
        balance: account.balance
      }
    }
    res.status(201).send(responseObject);

  } catch (err) {
    const msg = err.message;

    // Sends the error message to the client
    switch (msg) {
      case 'value':
        res.status(400).send('Error :( - Value for deposit must be greater than 0');
        break;
      default:
        res.status(500).send(`An unexpect error happened :( [${msg}]`);
    }
  }
}

/**
 * Makes a withdraw from an existing account
 * @param {*} res Response object
 * @param {*} param1 Withdraw information (origin: id of the account and amount: value for withdraw)
 */
async function doWithdraw(res, { origin, amount }) {
  try {
    // If the deposit amount is less than or equal to zero, return error
    if (amount <= 0) {
      throw new Error('value');
    }

    let accountResp = await facade.findById(origin);

    // If something goes wrong, throw error
    if (accountResp.status === 'fail') {
      throw new Error(accountResp.detail);
    }

    // If account not found, throw 404 error
    if (accountResp.status === 'ok' && !accountResp.detail) {
      throw new Error('404');
    }

    // If account found, update the balance and save to storage
    let account = accountResp.detail;
    account.balance -= amount;
    let updateResp = await facade.updateAccount(account);

    // If update fails, throw error
    if (updateResp.status === 'fail') {
      throw new Error(updateResp.detail);
    }

    // If update works, return response to client
    const responseObject = {
      origin: {
        id: account.id,
        balance: account.balance
      }
    }
    res.status(201).send(responseObject);
  } catch (err) {
    const msg = err.message;

    // Sends the error message to the client
    switch (msg) {
      case 'value':
        res.status(400).send('Error :( - Value for withdraw must be greater than 0');
        break;
      case '404':
        res.status(404).send('0');
        break;
      default:
        res.status(500).send(`An unexpect error happened :( [${msg}]`);
    }
  }
}

async function doTransfer(res, { origin, amount, destination }) {
  try {
    // If the deposit amount is less than or equal to zero, return error
    if (amount <= 0) {
      throw new Error('value');
    }

    // Find origin account
    let originAccountResp = await facade.findById(origin);

    // If finding account goes wrong, throw error
    if (originAccountResp.status === 'fail') {
      throw new Error(originAccountResp.detail);
    }

    // If origin account does not exist, throw origin error
    if (originAccountResp.status === 'ok' && !originAccountResp.detail) {
      throw new Error('origin');
    }

    let originAccount = originAccountResp.detail;

    // Find destination account
    let destAccountResp = await facade.findById(destination);

    // If finding account goes wrong, throw error
    if (destAccountResp.status === 'fail') {
      throw new Error(destAccountResp.detail);
    }

    // If destination account does not exist, throw destination error
    if (destAccountResp.status === 'ok' && !destAccountResp.detail) {
      throw new Error('destination')
    }

    let destAccount = destAccountResp.detail;

    // Update origin account
    originAccount.balance -= amount;

    // Update destination account
    destAccount.balance += amount;

    // Update origin account in storage
    let updateResp = await facade.updateAccount(originAccount);

    // If update account goes wrong, throw error
    if (updateResp.status === 'fail') {
      throw new Error(updateResp.detail);
    }

    // Update destination account in storage
    updateResp = await facade.updateAccount(destAccount);

    // If update account goes wrong, throw error
    if (updateResp.status === 'fail') {
      throw new Error(updateResp.detail);
    }

    // Create response
    const responseObject = {
      origin: {
        id: originAccount.id,
        balance: originAccount.balance
      },
      destination: {
        id: destAccount.id,
        balance: destAccount.balance
      }
    }

    // Send response to client
    res.status(201).send(responseObject);

  } catch (err) {
    const msg = err.message;

    // Sends the error message to the client
    switch (msg) {
      case 'value':
        res.status(400).send('Error :( - Value for withdraw must be greater than 0');
        break;
      case 'origin':
        res.status(404).send('0');
        break;
      case 'destination':
        res.status(404).send('Error :( - Destination account does not exist');
        break;
      default:
        res.status(500).send(`An unexpect error happened :( [${msg}]`);
    }
  }
}

// exports
/**
 * Resets the storage, initialize an account with number 300 and 
 * loads the var accountsArray
 * @param {*} ___ Request object (not used)
 * @param {*} res Response object
 */
exports.reset = async (___, res) => {

  try {
    // Resets the storage media for the accounts
    let resp = await facade.resetStorage();

    // If it fails to reset storage, throw error
    if (resp.status === 'fail') {
      throw new Error(resp.detail);
    }

    // Write the first account to the array
    if (resp.status === 'ok') {
      resp = await initFirstAccount();
    }

    // If it fails to initialize first account, throw error
    if (resp.status === 'fail') {
      throw new Error(resp.detail);
    }

    // Return message to client
    if (resp.status === 'ok') {
      res.status(200).send('OK');
    }

  } catch (err) {
    // Sends the error message to the client
    res.status(500).send(`An unexpect error happened :( [${err.message}]`);
  }
}

/**
 * Create an account based on the data passed in the request object
 * @param {*} req Request object
 * @param {*} res Response object
 */
exports.processAccountEvent = async (req, res) => {
  try {
    // Get the data from the request
    const dataToProcess = req.body;

    let check = checkFields(dataToProcess);

    // Check if data is valid
    if (!check) {
      throw new Error('fields');
    }

    // Process event according to the type
    switch (dataToProcess.type) {
      case 'deposit':
        doDeposit(res, dataToProcess);
        break;
      case 'withdraw':
        doWithdraw(res, dataToProcess);
        break;
      case 'transfer':
        doTransfer(res, dataToProcess);
        break;
      default:
        throw new Error('type')
    }
  } catch (err) {
    // Sends the error message to the client
    const msg = err.message;
    switch (msg) {
      case 'fields':
        res.status(400).send('Error :( - Data is missing from the request');
        break;
      case 'type':
        res.status(400).send('Error :( - The type of the process is not recognized by the server (try one of these: deposit, transfer or withdraw');
        break;
      default:
        res.status(500).send(`An unexpected error happened :( [${msg}]`)
    }
  }
}

/**
 * Return the balance of an existing account
 * @param {*} req Request object
 * @param {*} res Response object
 */
exports.getBalance = async (req, res) => {
  try {
    // If query params not found, throw error
    if (!req.query.account_id) {
      throw new Error('query');
    }

    // Gets the query params from the request
    const accountId = req.query.account_id;

    // Get account from storage
    let accountResp = await facade.findById(accountId);

    // If find account fails, throw error
    if (accountResp.status === 'fail') {
      throw new Error(accountResp.detail);
    }

    // If account not found, throw account error
    if (accountResp.status === 'ok' && !accountResp.detail) {
      throw new Error('account');
    }

    // Return the balance to the client
    res.status(200).send(accountResp.detail.balance.toString());
  } catch (err) {
    // Sends the error message to the client
    const msg = err.message;
    switch (msg) {
      case 'query':
        res.status(400).send('Error :( - Query data is missing from the request');
        break;
      case 'account':
        res.status(404).send('0');
        break;
      default:
        res.status(500).send(`An unexpected error happened :( [${msg}]`)
    }
  }
}

/**
 * Test function to check the status of the storage
 * @param {*} ___ Request object (not used)
 * @param {*} res Response object
 */
exports.test = async (___, res) => {
  try {
    // Fetch data
    let respFetchAccounts = await facade.listAll();

    // If it fails, throw error
    if (respFetchAccounts.status === 'fail') {
      throw new Error(respFetchAccounts.detail);
    }

    // Return data
    res.status(200).send(respFetchAccounts.detail);
  } catch (err) {
    // Sends the error message to the client
    res.status(500).send(`An unexpect error happened :( [${err.message}]`);
  }
}