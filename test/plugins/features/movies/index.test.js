'use strict';

const Knex = require('../../../../lib/libraries/knex.js');

const Controller = require('../../../../lib/plugins/features/movies/controller');

const Movies = require('../../../../lib/server');

describe('movies integration', () => {

  beforeEach('clear tables before test start', async () => {

    await Knex.raw('TRUNCATE movies CASCADE');

  });

  describe('post', () => {

    it('posts a movie', async () => {
      const response = await Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Inception' }
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result.object).to.eql('movie');
    });

  });

  describe('get', () => {

    it('returns a list of movies', async () => {
      const params = { title: 'Inception', release_year: 2010 };
      await Controller.create(params);
      const response = await Movies.inject({
        url: '/movies?title=ion&fuzzy_title=true&release_year=2010',
        method: 'GET'
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result[0].object).to.eql('movie');
      expect(response.result[0].title).to.eql(params.title);
    });

  });

});
