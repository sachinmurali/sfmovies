'use strict';

const Controller          = require('./controller');
const MovieValidator      = require('../../../validators/movie');
const MovieListValidator  = require('../../../validators/movielist');

exports.register = (server, options, next) => {

  server.route([
    {
      method: 'POST',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.create(request.payload));
        },
        validate: {
          payload: MovieValidator
        }
      }
    },
    {
      method: 'GET',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.getAllMovies(request.query));
        },
        validate: {
          query: MovieListValidator
        }
      }
    }
  ]);

  next();

};

exports.register.attributes = {
  name: 'movies'
};
