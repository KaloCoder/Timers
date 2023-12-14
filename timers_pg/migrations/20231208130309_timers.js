exports.up = function (knex) {
  return knex.schema.createTable("timers", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.foreign("user_id").references("users.id");
    table.datetime("start");
    table.string("description", 255).notNullable();
    table.boolean("isActive").defaultTo(true);
    table.integer("progress").defaultTo(0);
    table.datetime("end");
    table.integer("duration");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("timers");
};
