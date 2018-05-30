const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const FileBasedRepository = require('../../domain/TravelDestination/FileBasedRepository');
const User = require('../../domain/TravelDestination/User');
const ErrorMessage = require('../../utils/ErrorMessage');
const uuid = require('uuid/v4');
const fs = require('fs-extra')

describe('FileBasedRepository', function() {

  const TMP_DIRECTORY = './tmp/repository/';
  var repository;

  beforeEach('before each test build the repository', function() {
    repository = new FileBasedRepository(TMP_DIRECTORY);
  });

  afterEach('after each test clear the repository', function() {
    repository.clear();
  });

  describe('#persist()', function() {
    it('when a user is persisted to the repository, it is added to the file system', function(done) {
      // Given
      var userId = uuid();
      var travelId = uuid();
      var user = new User('foo', userId, [travelId]);

      // When
      var promise = repository.persist(user);

      // Then
      promise.then(returnedUser => {
        expect(fs.pathExistsSync(TMP_DIRECTORY + userId + "/user.json")).to.be.true;

        expect(returnedUser.userId).to.be.a('string');
        expect(returnedUser.userId).to.equal(userId);
        expect(returnedUser.userName).to.be.a('string');
        expect(returnedUser.userName).to.be.equal('foo');
        expect(returnedUser.travelDestinationIds).to.have.lengthOf(1);
        expect(returnedUser.travelDestinationIds[0]).to.be.a('string');
        expect(returnedUser.travelDestinationIds[0]).to.be.equal(travelId);

        done();
      })
      .catch(error => expect(error).fail());

    });
  });

  describe('#persist()', function() {
    it('test that when a user is persisted to the repository twice, that the'
      + '\n first time it is added to the file system'
      + '\n and the second time an error is thrown', function(done) {

        // Given
        var userId = uuid();
        var travelId = uuid();
        var user = new User('foo', userId, [travelId]);

        // When
        repository.persist(user).then(returnedUser => {
          var promise = repository.persist(user);

          expect(Promise.all([
            // The user should be there
            expect(fs.pathExists(TMP_DIRECTORY + userId + "/user.json")).to.eventually.be.true,
            // But the promise result of the second attempt should be rejected
            expect(promise).to.be.rejected
          ]))
          .and.notify(done);

        }).catch(error => done(error));
    })
  });

});
