'use strict';

const Boom = require('@hapi/boom');

const Movie = require('../../../models/movie');
const Location = require('../../../models/location');

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

exports.createLocation = async (movieId, payload) => {
  const movie = await new Movie({ id: movieId })
    .fetch({
      withRelated: 'locations',
      require: true
    })
    .catch(() => {
      throw Boom.notFound('Movie not found');
    });

  let locationToAdd;
  const location = await new Location({ name: payload.location_name })
    .fetch({ require: true })
    .catch(
      async () => {
        locationToAdd = await new Location({ name: payload.location_name }).save();
        movie.locations().attach(locationToAdd);
        return new Movie({ id: movieId })
          .fetch({
            require: true,
            withRelated: 'locations'
          });
      }
    );

  const isLocationAttachedToMovie = movie.related('locations').models
    .map((res) => res.id)
    .includes(location.id);

  if (!isLocationAttachedToMovie) {
    movie.locations().attach(location);
  }

  return new Movie({ id: movieId })
    .fetch({
      require: true,
      withRelated: 'locations'
    });
};
