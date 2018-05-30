/**
* Combines an error message with a status code which is necessary for
* HTTP-responses.
**/
class ErrorMessage {

  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  toJson() {
    return {
      "code": this.code,
      "message": this.message
    };
  }

  static fromJson(errorMessage) {
    return new ErrorMessage(errorMessage["code"], errorMessage["message"]);
  }

  static serverError() {
    return new ErrorMessage(500, "Internal server error");
  }

  static invalidPayload() {
    return new ErrorMessage(400, "Invalid payload.");
  }

  static alreadyExists() {
    return new ErrorMessage(409, "Conflict, entity already exists");
  }

}

module.exports = ErrorMessage;
