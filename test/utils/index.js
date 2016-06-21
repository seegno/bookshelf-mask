
/**
 * Export `recreateTables`.
 */

export function recreateTables(repository) {
  return repository.knex.schema
    .dropTableIfExists('Post')
    .dropTableIfExists('Author')
    .createTable('Author', table => {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
    })
    .createTable('Post', table => {
      table.increments('id').primary();
      table.integer('authorId').unsigned().references('Author.id');
      table.string('title');
      table.string('body');
    });
}

/**
 * Export `clearTables`.
 */

export async function clearTables(repository) {
  await repository.knex('Post').del();
  await repository.knex('Author').del();
}

/**
 * Export `dropTables`.
 */

export function dropTables(repository) {
  return repository.knex.schema
    .dropTable('Post')
    .dropTable('Author');
}

/**
 * Export `fixtures`.
 */

export function fixtures(repository) {
  const Post = repository.Model.extend({
    masks: {
      private: 'foo'
    },
    tableName: 'Post'
  });

  const Author = repository.Model.extend({
    posts() {
      return this.hasMany(Post, 'authorId');
    },
    tableName: 'Author',
    virtuals: {
      name() {
        return `${this.get('firstName')} ${this.get('lastName')}`;
      }
    }
  });

  return { Author, Post };
}
