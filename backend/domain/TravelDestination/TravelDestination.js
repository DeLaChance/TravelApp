const TravelDestinationDto = require('./TravelDestinationDto');

class TravelDestination {

  constructor(id, name, country, visitTime, photos) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.visitTime = visitTime;
    this.photos = photos;
  }

  toJson() {
    return {
      "id": this.id,
      "name": this.name,
      "country": this.country,
      "visitTime": this.visitTime,
      "photos": this.photos
    };
  }

  static fromJson(jsonBlob) {
    return new TravelDestination(jsonBlob['id'], jsonBlob['name'], jsonBlob['country']
      , jsonBlob['visitTime'], jsonBlob['photos']);
  }

  static fromDto(id, dto) {
    const jsonBlob = dto.toJson();
    jsonBlob['id'] = id;
    return TravelDestination.fromJson(jsonBlob);
  }

}

module.exports = TravelDestination;
