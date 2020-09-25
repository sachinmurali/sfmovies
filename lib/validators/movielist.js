'use strict';

const Joi = require('joi');

const MovieListValidator = Joi.object().keys({
  title: Joi.string().min(1).max(255).required(),
  fuzzy_title: Joi.boolean().optional(),
  release_year: Joi.number().integer().min(1878).max(9999).optional(),
  after: Joi.number().integer().min(1878).max(9999).optional(),
  before: Joi.number().integer().min(1878).max(9999).optional()
}).and('title', 'fuzzy_title')
  .without('release_year', ['after', 'before'])
  .without('after', 'release_year')
  .without('before', 'release_year');

module.exports = MovieListValidator;
