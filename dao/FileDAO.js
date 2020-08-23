// imports
const fs = require('fs');

// constants
const fileName = 'accounts.json';
const resetData = [];

// internal functions
/**
 * Read the file and return it's content
 */
const readFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/${fileName}`, 'utf8', (err, data) => {
      if (err) {
        console.log('Read fails!');
        console.log(err);
        reject(err);
      }
      resolve(data);
    })
  })
}

/**
 * Write data to the file
 * @param {*} data Data to be saved to file
 */
const writeToFile = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        console.log('Write fails!');
        console.log(err);
        reject({ status: 'fail', detail: err });
      }
      resolve({ status: 'ok', detail: null });
    })
  })
}

// exports
/**
 * Fetch accounts from file
 */
exports.fetchAccounts = async () => {
  try {
    // Read the accounts file
    let allAccounts = await readFromFile();

    // Parse from string to json
    allAccounts = JSON.parse(allAccounts);

    // Return file content
    return ({ status: 'ok', detail: allAccounts });
  } catch (err) {
    console.log('Fetch Account Fails!');
    console.log(err);
    return ({ status: 'fail', detail: '500' });
  }
}

/**
 * Find one account by the account Id
 * @param {*} accountId Id of the requested account
 */
exports.findOne = async (accountId) => {
  try {
    // Fetch all data from file
    let allAccounts = await readFromFile();

    // If there's no data, return empty array
    if (!allAccounts) {
      return ({ status: 'ok', detail: [] })
    }

    // Convert to json
    allAccounts = JSON.parse(allAccounts);

    // If there are data, then try to find specific account id
    let account = allAccounts.find((acc) => acc.id === accountId);

    // Return what was found
    return ({ status: 'ok', detail: account });
  } catch (err) {
    console.log('Find on Fails!');
    console.log(err);
    return ({ status: 'fail', detail: '500' });
  }
}

exports.createAccount = async (accountData) => {
  try {
    // Read accounts from file
    let allAccounts = await readFromFile();

    // Converts to json
    allAccounts = JSON.parse(allAccounts);

    // Add account to array of accounts
    allAccounts.push(accountData);

    // Writes array to file
    await writeToFile(allAccounts);

    // Return status
    return ({ status: 'ok', detail: null });
  } catch (err) {
    console.log('Create account Fails!');
    console.log(err);
    return ({ status: 'fail', detail: '500' });
  }
}

/**
 * Update one specific account
 * @param {*} param0 Account object info (object with id and balance)
 */
exports.updateAccount = async ({id, balance}) => {
  try {
    // Read accounts from file
    let allAccounts = await readFromFile();

    // Converts to json
    allAccounts = JSON.parse(allAccounts);

    // Find index of data to be updated
    let accountIndex = allAccounts.findIndex((acc) => acc.id === id);

    // If data not found, throw 404 error
    if (accountIndex < 0) {
      throw new Error('404');
    }

    // If data found, update it
    allAccounts[accountIndex].balance = balance;

    // Write the accounts array to file
    await writeToFile(allAccounts);

    //return status ok
    return ({status: 'ok', detail: null});

  } catch (err) {
    console.log('Update account Fails!');
    console.log(err);
    return ({status: 'fail', detail: (err.message === '404' ? '404' : '500')});
  }
}

/**
 * Resets the account file
 */
exports.resetStorage = async () => {
  try {
    // Writes an empty array to the file (creating one if doesn't exists)
    await writeToFile(resetData);

    // Return status
    return ({status: 'ok', detail: null});

  } catch (err) {
    console.log('Reseting file Fails!');
    console.log(err);
    return ({status: 'fail', detail: '500'});
  }
}