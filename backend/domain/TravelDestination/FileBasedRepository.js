const fs = require('fs-extra')

const { config } = require('../../config/index')
const TravelDestination = require('./TravelDestination')
const User = require('./User')

/**
* A FileBasedRepository holds the list of travel destinations (@see TravelDestination)
* for each user (@see User).
*
* It is a very simple implementation of a CRUD-store, not meant to be scalable or reliable.
**/
class FileBasedRepository {

  constructor() {
    this.directory = config.data.directory;
    fs.ensureDirSync(this.directory);

    // Currently the backend only supports a single user
    // TODO: move to business logic layer
    this.persist(new User('localuser', 'dced84b9-b20e-4cdc-9cc4-1a3e417a36e4', []));

    console.log("FileBasedRepository initialized under directory %s ", this.directory);
  }

  /**
  * Adds a new user to the repository
  *
  * @return a (@see Promise) with a new (@see User)
  **/
  persist(user) {
    return fs.ensureFile(this.directory + user.userId)
      .then(() => {
        console.log("FileBasedRepository: created user %s", user.userName);
        return user;
      })
      .catch(error => {
        console.log("FileBasedRepository: could not create new user, already exists" + error)
      });
  }

}

module.exports = new FileBasedRepository();
