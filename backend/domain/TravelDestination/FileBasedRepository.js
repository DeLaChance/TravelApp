const fs = require('fs-extra')
const Optional = require('optional-js');

const { config } = require('../../config/index')
const TravelDestination = require('./TravelDestination')
const User = require('./User')

/**
* A FileBasedRepository holds the list of users (@see User).
*
* It is a very simple implementation of a CRUD-store, not meant to be scalable or reliable.
**/
class FileBasedRepository {

  constructor() {
    this.directory = config.data.directory;
    fs.ensureDirSync(this.directory);

    // Currently the backend only supports a single user
    // TODO: move to business logic layer
    const localUser = new User('localuser', 'dced84b9-b20e-4cdc-9cc4-1a3e417a36e4', ['4ccb2177-eded-44de-9b1e-45781bcf6320']);
    this.persist(localUser)
      .then(localUser => this.fetchDestinations(localUser.userId))
      .then(destinationList => destinationList.forEach(destination => console.log(destination.name))); // A sweet reminder: tidy up this method

    console.log("FileBasedRepository initialized under directory %s ", this.directory);
  }

  /**
  * Adds a new user to the repository
  *
  * @return a (@see Promise) with a new (@see User)
  **/
  persist(user) {
    const directoryName = this.directory + user.userId + "/";
    const userFileName = directoryName + "user.json";
    return fs.ensureDir(directoryName)
      .then(() => fs.ensureFile(userFileName))
      .then(() => fs.writeJson(userFileName, user.toJson()))
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
  * @param the user id
  *
  * @return a (@see Promise) with a (@see Optional). The optional
  * contains the user if it exists and is empty otherwise.
  **/
  tryFindUserById(userId) {
    const userFileName = this.directory + userId + "/user.json";
    return fs.pathExists(userFileName)
      .then(fileExists => {
        if( fileExists ) {
          return fs.readJson(userFileName);
        } else {
          return Promise.resolve(null);
        }
      })
      .then(jsonObject => {
        return Optional.ofNullable(jsonObject)
      })
      .catch(error => {
        console.error("Error while reading file %s due to: %s", userFileName, error);
      });
  }

  /**
  * Finds the list of travel destinations (@see TravelDestination) for a given user.
  *
  * @param the user id
  *
  * @return a (@see Promise) with a (@see List of @see TravelDestination)
  */
  fetchDestinations(userId) {
    const directoryName = this.directory + userId + "/";

    return this.tryFindUserById(userId)
      .then(userOptional => {
        if( userOptional.isPresent() ) {
          return Promise.all(
              userOptional.get().travelDestinationIds
                .map(id => this.tryFetchDestinationById(userId, id)
                  .then(optional => {
                    if( optional.isPresent() ) {
                      return Promise.resolve(optional.get());
                    } else {
                      return Promise.reject(format("No such travel destination {}", id));
                    }
                  })
                )
          );
        } else {
          return Promise.reject(format("User {} should exist", userId));
        }
      });
  }

  /**
  * Finds a travel destination (@see TravelDestination) by its identifier.
  *
  * @param the travel destination id
  *
  *
  * @return a (@see Promise) with a (@see Optional of @see TravelDestination).
  */
  tryFetchDestinationById(userId, destinationId) {
    const destinationFileName = this.directory + userId + "/" + destinationId;

    return fs.pathExists(destinationFileName)
      .then(fileExists => {
        if( fileExists ) {
          return fs.readJson(destinationFileName)
            .catch(error => console.error("Error while reading file %s", destinationFileName));
        } else {
          return Promise.resolve(null);
        }
      })
      .then(travelDestinationJsonBlob => {
        return Optional.ofNullable(TravelDestination.fromJson(travelDestinationJsonBlob));
      });
  }

}

module.exports = FileBasedRepository;
