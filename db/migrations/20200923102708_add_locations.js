'use strict';

exports.up = (Knex) => {
  return Knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.text('name').unique().notNullable();
  });
};

exports.down = (Knex) =>  {
  return Knex.schema.dropTable('locations');
};
