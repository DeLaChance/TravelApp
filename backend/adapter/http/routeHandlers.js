const format = require('string-format')
const validator = require('validator')

const ErrorMessage = require('../../utils/ErrorMessage')
const TravelDestinationDto = require('../../domain/TravelDestination/TravelDestinationDto')
const { repository } = require('../../domain/TravelDestination/index')

// TODO: add authorization/authentication to this file

/**
 * Renders courses list when `/courses` route is requested
 *
 * @param request - Object - Express request object
 * @param response - Object - Express response object
 * @param next - Function - express callback
 *
 * @returns {undefined}
 */
module.exports.tryFetchUserById = (request, response, next) => {
  const userId = request.params['userId'];

  if( !validator.isUUID(userId) ) {
    response.status(400).send("Provided parameter :userId is not a valid UUID");
  } else {
    repository.tryFindUserById(userId)
      .then(userOptional => {
         if( userOptional.isPresent() ) {
           response.status(200).json(userOptional.get());
         } else {
           response.status(404).send(format("User {} does not exist", userId));
         }
      });
  }
};

module.exports.tryFetchUserDestinations = (request, response, next) => {
  const userId = request.params['userId'];

  if( !validator.isUUID(userId) ) {
    response.status(400).send("Provided parameter :userId is not a valid UUID");
  } else {
    repository.fetchDestinations(userId)
      .then(travelDestinations => {
        response.status(200).json(travelDestinations);
      })
      .catch(errorMessage => {
        response.status(errorMessage.code).send(errorMessage.message);
      });
  }
};

module.exports.tryFetchUserDestinationById = (request, response, next) => {
  const userId = request.params['userId'];
  const destinationId = request.params['destinationId'];

  if( !validator.isUUID(userId) ) {
    response.status(400).send("Provided parameter :userId is not a valid UUID");
  } else if( !validator.isUUID(destinationId) ) {
    response.status(400).send("Provided parameter :destinationId is not a valid UUID");
  } else {
    repository.tryFetchDestinationById(userId, destinationId)
      .then(optionalDestination => {
          if( optionalDestination.isPresent() ) {
            response.status(200).json(optionalDestination.get());
          } else {
            response.status(404).send(format("User {} and/or destination {} do not exist.", userId, destinationId));
          }
      })
      .catch(errorMessage => {
        response.status(errorMessage.code).end(errorMessage.message);
      });
  }
};

module.exports.tryAddTravelDestination = (request, response, next) => {
  const jsonBlob = request.body;
  const userId = request.params['userId'];

  if( !validator.isUUID(userId) ) {
    response.status(400).send("Provided parameter :userId is not a valid UUID");
  } else if( TravelDestinationDto.isValid(jsonBlob) === true ) {
      const travelDestinationDto = TravelDestinationDto.fromJson(jsonBlob);
      repository.addTravelDestination(userId, travelDestinationDto)
        .then(travelDestination => {
          response.status(200).json(travelDestination);
        })
        .catch(errorMessage => {
          response.status(errorMessage.code).end(errorMessage.message);
        });
  } else {
    const errorMessage = ErrorMessage.invalidPayload();
    response.status(errorMessage.code).end(errorMessage.message);
  }
};

module.exports.tryDeleteUserDestinationById = (request, response, next) => {
  const userId = request.params['userId'];
  const destinationId = request.params['destinationId'];

  if( !validator.isUUID(userId) ) {
    response.status(400).send("Provided parameter :userId is not a valid UUID");
  } else if( !validator.isUUID(destinationId) ) {
    response.status(400).send("Provided parameter :destinationId is not a valid UUID");
  } else {
    response.removeTravelDestination(userId, destinationId)
      .then(() => {
        response.status(200).end();
      })
      .catch(errorMessage => {
        response.status(errorMessage.code).end(errorMessage.message);
      });
  }
};

module.exports.errorHandler = (fn) => {
  return function (request, response, next) {
    try {
      fn(request, response, next);
    }
    catch(e) {
      const errorMessage = ErrorMessage.serverError();
      response.status(errorMessage.code).send(errorMessage.message);
    }
  }
};
