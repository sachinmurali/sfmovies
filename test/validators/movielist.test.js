'use strict';

const Joi = require('joi');

const MovieListValidator = require('../../lib/validators/movielist');

describe('movie validator', () => {

  describe('title', () => {

    it('is required', () => {
      const payload = {};
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('title');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

  describe('fuzzy_title', () => {

    it('is boolean', () => {
      const payload = { title: 'a'.repeat(250), fuzzy_title: 'foo' };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('fuzzy_title');
      expect(result.error.details[0].type).to.eql('boolean.base');
    });

    it('appears with title', () => {
      const payload = { title: 'a'.repeat(250) };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].type).to.eql('object.and');
    });

  });

  describe('after', () => {

    it('should not appear with release_year', () => {
      const payload = {
        title: 'a'.repeat(250),
        fuzzy_title: true,
        release_year: 2000,
        after: 2001
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('release_year');
      expect(result.error.details[0].type).to.eql('object.without');
    });

  });

  describe('before', () => {

    it('should not appear with release_year', () => {
      const payload = {
        title: 'a'.repeat(250),
        fuzzy_title: true,
        release_year: 2000,
        before: 2001
      };
      const result = Joi.validate(payload, MovieListValidator);

      expect(result.error.details[0].path[0]).to.eql('release_year');
      expect(result.error.details[0].type).to.eql('object.without');
    });

  });

});
