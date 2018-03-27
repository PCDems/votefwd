'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('voters', function (table) {
    table.increments();
    table.string('first_name', 1024);
    table.string('last_name', 1024);
    table.string('middle_name', 1024);
    table.string('address', 1024);
    table.string('city', 1024);
    table.string('state', 128);
    table.string('zip', 128);
    table.string('adopter_user_id', 1024).references('auth0_id').inTable('users');
    table.timestamp('adopted_at');
    table.string('plea_letter_url', 1024);
    table.timestamp('confirmed_sent_at');
    table.timestamp('pledge_made_at');
    table.timestamps(false, true);
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('voters');  
};
