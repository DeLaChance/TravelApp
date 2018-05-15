const fs = require('fs-extra')
const Optional = require('optional-js');

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
    const localUser = new User('localuser', 'dced84b9-b20e-4cdc-9cc4-1a3e417a36e4', []);
    this.persist(localUser);
    //this.tryFindUserById(localUser.userId)
      //.then(userOptional => userOptional.ifPresent(user => console.log("is present")));

    console.log("FileBasedRepository initialized under directory %s ", this.directory);
  }

  /**
  * Adds a new user to the repository
  *
  * @return a (@see Promise) with a new (@see User)
  **/
  persist(user) {
    const fileName = this.directory + user.userId;
    return fs.ensureFile(fileName)
      .then(() => fs.writeJson(fileName, user.toJson()))
      .then(() => {
        console.log("FileBasedRepository: created user %s", user.userName);
        return user;
      })
      .catch(error => {
        console.error("FileBasedRepository: could not create new user, already exists" + error)
      });
  }

  /**
  * Tries to find a user by a given identifier.
  *
  * @return a (@see Promise) with a (@see Optional). The optional
  * contains the user if it exists and is empty otherwise.
  **/
  tryFindUserById(userId) {
    const fileName = this.directory + userId;
    return fs.pathExists(fileName)
      .then(fileExists => {
        if( fileExists ) {
          return fs.readJson(fileName);
        } else {
          return Promise.resolve(null);
        }
      })
      .then(jsonObject => {
        return Optional.ofNullable(jsonObject)
      })
      .catch(error => console.error("Error while reading file %s due to: %s", fileName, error));
  }

}

module.exports = new FileBasedRepository();
