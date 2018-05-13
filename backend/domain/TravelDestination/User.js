const TravelDestination = require('./TravelDestination')

class User {

  constructor(userName, userId, travelDestinations) {
    this.userName = userName;
    this.userId = userId;
    this.travelDestinations = travelDestinations;
  }

}

module.exports = User;
