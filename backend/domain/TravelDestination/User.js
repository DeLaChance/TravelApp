class User {

  constructor(userName, userId, travelDestinationIds) {
    this.userName = userName;
    this.userId = userId;
    this.travelDestinationIds = travelDestinationIds;
  }

  toJson() {
    return {
      "userName": this.userName,
      "userId": this.userId,
      "travelDestinationIds": this.travelDestinationIds
    };
  }

  static fromJson(userJson) {
    return new User(userJson['userName'], userJson['userId'], userJson['travelDestinationIds']);
  }

}

module.exports = User;
