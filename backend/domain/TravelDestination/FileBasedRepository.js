const fs = require('fs-extra')
const Optional = require('optional-js');
const uuid = require('uuid/v4');
const format = require('string-format')

const { config } = require('../../config/index')
const TravelDestination = require('./TravelDestination')
const TravelDestinationDto = require('./TravelDestinationDto')
const User = require('./User')
const ErrorMessage = require('../../utils/ErrorMessage')

/**
* A FileBasedRepository holds the list of users (@see User).
*
* It is a very simple implementation of a CRUD-store, not meant to be scalable or reliable.
**/
class FileBasedRepository {

  constructor(directory = config.data.directory) {
    this.directory = directory;
    fs.ensureDirSync(this.directory);

    console.log("FileBasedRepository initialized under directory %s ", this.directory);
  }

  /**
  * Clears all files in the repository. This actions irreversible.
  */
  clear() {
    return fs.remove(this.directory);
  }

  /**
  * Adds a new user to the repository
  *
  * @return a (@see Promise) with a new (@see User)
  **/
  persist(user) {
    const directoryName = this.directory + user.userId + "/";
    const userFileName = directoryName + "user.json";

    return this.tryFindUserById(user.userId)
      .then(userOptional => {
        if( !userOptional.isPresent() ) {
          return fs.ensureDir(directoryName)
            .then(() => fs.ensureFile(userFileName))
            .then(() => fs.writeJson(userFileName, user.toJson()))
            .then(() => {
              console.log("FileBasedRepository: created user %s", user.userName);
              return user;
            })
            .catch(error => {
              return Promise.reject(ErrorMessage.serverError());
            });
        } else {
          return Promise.reject(ErrorMessage.alreadyExists());
        }
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
        return Optional.ofNullable(jsonObject).map(User.fromJson);
      })
      .catch(error => {
        console.error("Error while reading file %s due to: %s", userFileName, error);
        return Promise.reject(ErrorMessage.serverError());
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
                      return Promise.reject(new ErrorMessage(404, format("No such travel destination {} for user {}", id, userId)));
                    }
                  })
                )
          );
        } else {
          return Promise.reject(new ErrorMessage(404, format("User {} should exist", userId)));
        }
      });
  }

  /**
  * Finds a travel destination (@see TravelDestination) by its identifier.
  *
  * @param the travel destination id
  * @param the user id
  *
  * @return a (@see Promise) with a (@see Optional of @see TravelDestination).
  */
  tryFetchDestinationById(userId, destinationId) {
    const destinationFileName = this.directory + userId + "/" + destinationId;

    return fs.pathExists(destinationFileName)
      .then(fileExists => {
        if( fileExists ) {
          return fs.readJson(destinationFileName);
        } else {
          return Promise.resolve(null);
        }
      })
      .then(travelDestinationJsonBlob => {
        return Optional.ofNullable(travelDestinationJsonBlob).map(TravelDestination.fromJson);
      })
      .catch(error => {
          console.error("Error while reading file %s", destinationFileName);
          return Promise.reject(ErrorCode.serverError());
      });
  }

  /**
  * Adds a travel destination (@see TravelDestination) for a user given a dto
  * (@see TravelDestinationDto)
  *
  * @param the user id
  * @param the travel destination dto
  *
  * @return a (@see Promise) with either the updated/added travel destination
  */
  addTravelDestination(userId, dto) {
    const destinationId = uuid();
    const userDir = this.directory + userId + "/";

    return this.tryFindUserById(userId)
      .then(userOptional => {
        if( userOptional.isPresent() ) {
          const user = userOptional.get();
          user.addDestination(destinationId);

          return fs.writeJson(userDir + destinationId, TravelDestination.fromDto(destinationId, dto).toJson())
            .then(() => fs.writeJson(userDir + "user.json", user.toJson()))
            .catch(error => {
              console.error("Could not add travel destination due to: %s", error);
              return Promise.reject(ErrorCode.serverError());
            });
        } else {
          return Promise.reject(new ErrorCode(404, format("User {} does not exist", userId)));
        }
      })
      .then(travelDestination => {
        return travelDestination;
      });
  }

  /**
  * Removes a travel destination (@see TravelDestination) for a given user.
  *
  * @param the user id
  * @param the destination id
  *
  * @return an empty (@see Promise) that is rejected when the file could not be deleted
  * and fulfilled when it could.
  */
  removeTravelDestination(userId, destinationId) {
    const destinationFileName = this.directory + userId + "/" + destinationId;

    return fs.pathExists(destinationFileName)
      .then(fileExists => {
        if( fileExists ) {
          return fs.remove(destinationFileName);
        } else {
          return Promise.reject(new ErrorCode(404, format("User {} or destination {}" +
            "does not exist and cannot be deleted.", userId, destinationId)));
        }
      });
  }

}

module.exports = FileBasedRepository;
