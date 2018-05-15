const TravelDestination = require('./TravelDestination')

class User {

  constructor(userName, userId, travelDestinations) {
    this.userName = userName;
    this.userId = userId;
    this.travelDestinations = travelDestinations;
  }

  toJson() {
    return {
      "userName": this.userName,
      "userId": this.userId,
      "travelDestinations": this.travelDestinations
    };
  }

  static fromJson(userJson) {
    return new User(userJson['userName'], userJson['userId'], userJson['travelDestinations']);
  }

}

module.exports = User;
