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

}

module.exports = TravelDestinationDto;
