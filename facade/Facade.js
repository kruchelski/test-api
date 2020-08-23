// imports

const fileDao = require('../dao/FileDAO');

// exports
/**
 * Resets the storage
 */
exports.resetStorage = async () => {
  return await fileDao.resetStorage();
}

/**
 * Fetch all the existing accounts
 */
exports.listAll = async () => {
  return await fileDao.fetchAccounts();
}

/**
 * Return one account from the storage by the ID
 * @param {*} accountId Account ID
 */
exports.findById = async (accountId) => {
  return await fileDao.findOne(accountId);
}

/**
 * Add an account
 * @param {*} accountData Data of the account to be added
 */
exports.addAccount = async (accountData) => {
  return await fileDao.createAccount(accountData);
}

/**
 * Update an existing account;
 * @param {*} updateData 
 */
exports.updateAccount = async (updateData) => {
  return await fileDao.updateAccount(updateData);
}