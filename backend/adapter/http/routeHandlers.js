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
