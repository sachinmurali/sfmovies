'use strict';

const Movie = require('../../../models/movie');

exports.create = async (payload) => {
  payload.name = payload.title;
  Reflect.deleteProperty(payload, 'title');

  const movie = await new Movie().save(payload);
  return new Movie({ id: movie.id }).fetch();
};

exports.getAllMovies = (params) => {
  return new Movie().query((movie) => {
    params = params || {};

    if (params.release_year) {
      movie.where('release_year', params.release_year);
    }
    if (params.after) {
      movie.where('release_year', '>=', params.after);
    }
    if (params.before) {
      movie.where('release_year', '<=', params.before);
    }
    if (params.title) {
      if (params.fuzzy_title) {
        movie.where('name', 'ilike', `%${params.title}%`);
      } else {
        movie.where('name', params.title);
      }
    }
  }).fetchAll();
};
