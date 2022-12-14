import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.integer('role_id').unsigned().references('roles.id').onDelete("CASCADE").notNullable().defaultTo(1)
      table.string('provider').nullable();
      table.string('provider_id').nullable();
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
       table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())


    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
