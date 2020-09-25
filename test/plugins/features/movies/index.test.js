'use strict';

const Knex = require('../../../../lib/libraries/knex.js');

const Controller = require('../../../../lib/plugins/features/movies/controller');

const Movies = require('../../../../lib/server');

describe('movies integration', () => {

  beforeEach('clear tables before test start', async () => {

    await Knex.raw('TRUNCATE movies CASCADE');
    await Knex.raw('TRUNCATE locations CASCADE');
    await Knex.raw('TRUNCATE movies_locations CASCADE');

    const moviePayload = {
      id: 123,
      name: 'Foo Bar',
      release_year: 1900
    };
    const locationPayload = { id: 123, name: 'Boulder' };
    await Knex('movies').insert(moviePayload);
    await Knex('locations').insert(locationPayload);
  });

  describe('POST', () => {

    it('posts a movie', async () => {
      const response = await Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Inception' }
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result.object).to.eql('movie');
    });

    it('throws a 404 when a movie is not found', async () => {
      const response = await Movies.inject({
        url: '/movies/999/locations',
        method: 'POST',
        payload: { location_name: 'San Francisco' }
      });

      expect(response.statusCode).to.eql(404);
    });

    it('attaches locations to movies', async () => {
      const response = await Movies.inject({
        url: '/movies/123/locations',
        method: 'POST',
        payload: { location_name: 'Boulder' }
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result.object).to.eql('movie');
      expect(response.result.locations.models[0].get('name')).to.eql('Boulder');
    });

  });

  describe('GET', () => {

    it('returns a list of movies', async () => {
      const params = { title: 'Inception', release_year: 2010 };
      await Controller.create(params);
      const response = await Movies.inject({
        url: '/movies?title=ion&fuzzy_title=true&release_year=2010',
        method: 'GET'
      });

      expect(response.statusCode).to.eql(200);
      expect(response.result[0].object).to.eql('movie');
      expect(response.result[0].title).to.eql('Inception');
    });

  });

});
