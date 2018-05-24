const _ = require('lodash')

class TravelDestinationDto {

  constructor(name, country, visitTime, photos) {
    this.name = name;
    this.country = country;
    this.visitTime = visitTime;
    this.photos = photos;
  }

  toJson() {
    return {
      "name": this.name,
      "country": this.country,
      "visitTime": this.visitTime,
      "photos": this.photos
    };
  }

  static fromJson(jsonBlob) {
    return new TravelDestinationDto(jsonBlob['name'], jsonBlob['country']
      , jsonBlob['visitTime'], jsonBlob['photos']);
  }

  /**
  * Validates whether the given json can be converted into a (@see TravelDestinationDto).
  *
  * @param jsonBlob:
  *             the json
  *
  * @return True if and only if the json is valid
  */
  static isValid(jsonBlob) {
    return _.has(jsonBlob, ["name"]) &&
      _.has(jsonBlob, ["country"]) &&
      _.has(jsonBlob, ["visitTime"]) &&
      _.has(jsonBlob, ["photos"]);
  }

}

module.exports = TravelDestinationDto;
