'use strict';

var expect = require('chai').expect;

var db = require('../server/db');
var voterService = require('../server/voterService');

describe('voterService', function() {
  describe('adoptRandomVoter', function() {
    before(function() {
      voterService._prepForTests();
    });

    it('should error if not a valid number of voters requested', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 10, function(error, adoptees) {
        expect(error).not.to.be.null;
        expect(error.message).to.eql('Invalid number of voters requested');
        done();
      });
    });

    it('should do nothing if not enough voters left', function(done) {
      voterService.adoptRandomVoter(this.users.regular.auth0_id, 256, function(error, adoptees) {
        expect(adoptees.length).to.eql(0);
        done();
      });
    });

    it('should do nothing if user is not allowed to adopt more voters', function(done) {
      voterService.adoptRandomVoter(this.users.full, 15, function(error, adoptees) {
        expect(adoptees.length).to.eql(0);
        done();
      });
    });

    // Pending b/c we need to mock out letterService and slackService
    it('should let the user adopt voters');
  });
});
