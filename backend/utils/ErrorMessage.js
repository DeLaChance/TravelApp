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
    return new ServerError(500, "Internal server error")
  }

}

module.exports = ErrorMessage;
