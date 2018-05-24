const format = require('string-format')

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

  repository.tryFindUserById(userId)
    .then(userOptional => {
       if( userOptional.isPresent() ) {
         response.status(200).json(userOptional.get());
       } else {
         response.status(404).send(format("User {} does not exist", userId));
       }
    });
};

module.exports.tryFetchUserDestinations = (request, response, next) => {
  const userId = request.params['userId'];

  repository.fetchDestinations(userId)
    .then(travelDestinations => {
      response.status(200).json(travelDestinations);
    })
    .catch(errorMessage => {
      console.log(errorMessage);
      console.log(errorMessage.toJson());
      response.status(errorMessage.code).send(errorMessage.message);
    });

};

module.exports.tryFetchUserDestinationById = (request, response, next) => {
  const userId = request.params['userId'];
  const destinationId = request.params['destinationId'];

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
};
