'use strict';

const Knex = require('../../../../lib/libraries/knex.js');

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Movie = require('../../../../lib/models/movie.js');

describe('movie controller', () => {

  beforeEach('clear tables before test start', async () => {

    await Knex.raw('TRUNCATE movies CASCADE');

  });

  describe('post', () => {

    it('posts a movie and gets back a serialized movie object', async () => {
      const payload = { title: 'WALL-E' };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);

    });

  });

  describe('get', () => {

    it('retrieves all the movies', async () => {
      const movieModelList = await new Movie().fetchAll();
      const controllerList = await Controller.getAllMovies();
      expect(movieModelList.length).to.eql(controllerList.length);
    });

    it('retrieves movies by release year and fuzzy match', async () => {
      const payload = { title: 'The Dark Knight', release_year: 2008 };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);

      const queryParams = {
        title: 'The',
        fuzzy_title: true,
        release_year: 2008
      };

      const controllerList = await Controller.getAllMovies(queryParams);
      expect(controllerList.length).to.eql(1);
      expect(controllerList.models[0].get('title')).to.eql(payload.title);

    });

    it('retrieves movies by release year and exact match', async () => {
      const payload = { title: 'The Dark Knight', release_year: 2008 };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);

      const queryParams = {
        title: 'The Dark Knight',
        fuzzy_title: false,
        release_year: 2008
      };

      const controllerList = await Controller.getAllMovies(queryParams);

      expect(controllerList.length).to.eql(1);
      expect(controllerList.models[0].get('title')).to.eql(payload.title);

    });

    it('gets movies by release year and exact match', async () => {
      const payload = { title: 'The Dark Knight', release_year: 2008 };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);

      const queryParams = {
        title: 'The Dark Knight',
        fuzzy_title: false,
        release_year: 2008
      };

      const controllerList = await Controller.getAllMovies(queryParams);

      expect(controllerList.length).to.eql(1);
      expect(controllerList.models[0].get('title')).to.eql(payload.title);

    });

    it('gets movies by passing a range', async () => {
      const payload = { title: 'The Dark Knight', release_year: 2008 };
      const movie = await Controller.create(payload);
      expect(movie.get('title')).to.eql(payload.title);

      const queryParams = {
        title: 'The Dark Knight',
        fuzzy_title: false,
        after: 2000,
        before: 2010
      };

      const controllerList = await Controller.getAllMovies(queryParams);

      expect(controllerList.length).to.eql(1);
      expect(controllerList.models[0].get('title')).to.eql(payload.title);
      expect(controllerList.models[0].get('release_year')).to.eql(payload.release_year);

    });

  });

});
