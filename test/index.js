
/**
 * Module dependencies.
 */

import bookshelf from 'bookshelf';
import knex from 'knex';
import knexfile from './knexfile';
import mask from '../src';
import { clearTables, dropTables, fixtures, recreateTables } from './utils';

/**
 * Test `bookshelf-mask` plugin.
 */

describe('bookshelf-mask', () => {
  const repository = bookshelf(knex(knexfile));

  repository.plugin(['virtuals', mask]);

  const { Author, Post } = fixtures(repository);

  before(async () => {
    await recreateTables(repository);
  });

  afterEach(async () => {
    await clearTables(repository);
  });

  after(async () => {
    await dropTables(repository);
  });

  describe('on a model', () => {
    it('should serialize to JSON if no mask is provided', () => {
      const model = Post.forge({ foo: 'bar' });

      model.mask().should.eql({ foo: 'bar' });
    });

    it('should mask with given registered scope', () => {
      const model = Post.forge({ foo: 'bar', biz: 'baz' });

      model.mask('private').should.eql({ foo: 'bar' });
    });

    it('should mask with given fields', () => {
      const model = Post.forge({ foo: 'bar', biz: 'baz', qux: 'qix' });

      model.mask('foo,biz').should.eql({ foo: 'bar', biz: 'baz' });
    });

    it('should omit unexistent fields', () => {
      const model = Post.forge({ foo: 'bar' });

      model.mask('qux').should.eql({});
    });

    it('should mask related models', async () => {
      const author = await Author.forge().save();

      await Post.forge().save({ authorId: author.get('id'), title: 'biz', body: 'baz' });
      await Post.forge().save({ authorId: author.get('id'), title: 'qux', body: 'qix' });

      const model = await Author.forge({ id: author.get('id') }).fetch({ withRelated: 'posts' });

      model.mask('posts(title,body)').should.eql({
        posts: [{
          body: 'baz',
          title: 'biz'
        }, {
          body: 'qix',
          title: 'qux'
        }]
      });
    });

    it('should not mask related models if `shallow` option is given as `true`', async () => {
      const author = await Author.forge().save();

      await Post.forge().save({ authorId: author.get('id') });

      const model = await Author.forge({ id: author.get('id') }).fetch({ withRelated: 'posts' });

      model.mask('posts/authorId', { shallow: true }).should.eql({});
    });

    it('should mask virtual values', () => {
      const model = Author.forge({ firstName: 'foo', lastName: 'bar' });

      model.mask('name').should.eql({ name: 'foo bar' });
    });

    it('should not mask virtual values if `virtuals` option is given as `false`', () => {
      const model = Author.forge({ firstName: 'foo', lastName: 'bar' });

      model.mask('name', { virtuals: false }).should.eql({});
    });
  });

  describe('on a collection', () => {
    const AuthorCollection = repository.Collection.extend({ model: Author });
    const PostCollection = repository.Collection.extend({ model: Post });

    it('should serialize to JSON if no mask is provided', () => {
      const collection = PostCollection.forge([{ foo: 'bar' }, { biz: 'baz' }]);

      collection.mask().should.eql([{ foo: 'bar' }, { biz: 'baz' }]);
    });

    it('should mask with given registered scope', () => {
      const collection = PostCollection.forge([{ foo: 'bar', qux: 'qix' }, { foo: 'biz', qux: 'qax' }]);

      collection.mask('private').should.eql([{ foo: 'bar' }, { foo: 'biz' }]);
    });

    it('should mask with given fields', () => {
      const collection = PostCollection.forge([{
        foo: 'bar', biz: 'baz', qux: 'qix'
      }, {
        foo: 'ber', biz: 'buz', qux: 'qax'
      }]);

      collection.mask('foo,biz').should.eql([{ foo: 'bar', biz: 'baz' }, { foo: 'ber', biz: 'buz' }]);
    });

    it('should omit unexistent fields', () => {
      const collection = PostCollection.forge([{ foo: 'bar' }, { biz: 'baz' }]);

      collection.mask('qux').should.eql([{}, {}]);
    });

    it('should mask related models', async () => {
      const author1 = await Author.forge().save();
      const author2 = await Author.forge().save();

      await Post.forge().save({ authorId: author1.get('id'), title: 'biz', body: 'baz' });
      await Post.forge().save({ authorId: author2.get('id'), title: 'qux', body: 'qix' });

      const collection = await AuthorCollection.forge().fetch({ withRelated: 'posts' });

      collection.mask('posts(title,body)').should.eql([{
        posts: [{ body: 'baz', title: 'biz' }]
      }, {
        posts: [{ body: 'qix', title: 'qux' }]
      }]);
    });

    it('should not mask related models if `shallow` option is given as `true`', async () => {
      const author1 = await Author.forge().save();
      const author2 = await Author.forge().save();

      await Post.forge().save({ authorId: author1.get('id') });
      await Post.forge().save({ authorId: author2.get('id') });

      const collection = await AuthorCollection.forge().fetch({ withRelated: 'posts' });

      collection.mask('id,posts/authorId', { shallow: true }).should.eql([{
        id: author1.get('id')
      }, {
        id: author2.get('id')
      }]);
    });

    it('should mask virtual values', () => {
      const collection = AuthorCollection.forge([{
        firstName: 'foo', lastName: 'bar'
      }, {
        firstName: 'qux', lastName: 'qix'
      }]);

      collection.mask('name').should.eql([{ name: 'foo bar' }, { name: 'qux qix' }]);
    });

    it('should not mask virtual values if `virtuals` option is given as `false`', () => {
      const collection = AuthorCollection.forge([{
        firstName: 'foo', lastName: 'bar'
      }, {
        firstName: 'qux', lastName: 'qix'
      }]);

      collection.mask('name', { virtuals: false }).should.eql([{}, {}]);
    });
  });
});
