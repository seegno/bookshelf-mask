# bookshelf-mask

This [Bookshelf.js](https://github.com/tgriesser/bookshelf) plugin enables you to define masks on your models and serialize to JSON based on its fields using the [json-mask](https://github.com/nemtsov/json-mask) API.

## Status

[![npm version][npm-image]][npm-url] ![node version][node-image] [![build status][travis-image]][travis-url] [![coverage status][coveralls-image]][coveralls-url]

## Installation

Install the package via **npm**:

```sh
$ npm install --save bookshelf-mask
```

## Usage

Require and register the **bookshelf-mask** plugin:

```js
var bookshelf = require('bookshelf')(knex);
var mask = require('bookshelf-mask');

bookshelf.plugin(mask);
```

Define masks on your models with `masks` class property:

```js
var Author = bookshelf.Model.extend({
  posts: {
    return this.hasMany(Post);
  },
  tableName: 'Author'
}, {
  masks: {
    custom: 'id,name'
  }
});
```

If you're using ES6 class syntax, define `masks` as static property:

```js
class Author extends bookshelf.Model {
  get tableName() {
    return 'Author';
  }

  posts() {
    return this.hasMany(Post);
  }

  static masks = {
    custom: 'id,name'
  }
}
```

Use the `mask` method to serialize the registered masks or pass the fields directly:

```js
Author
  .forge({ name: 'foo' })
  .fetch({ withRelated: 'posts' })
  .then(function(model) {
    console.log(model.mask('custom'));
    // => { id: 1, name: 'foo' }
    console.log(model.mask('name,posts(title,body)'));
    // => { name: 'foo', posts: [{ title: 'biz', body: 'baz' }, { title: 'qux', body: 'qix' }]}
  });
```

The `mask` method can be applied to collections and the same options accepted in `toJSON` can also be provided.

## Contributing

Contributions are welcome and greatly appreciated, so feel free to fork this repository and submit pull requests.

### Setting up

- Fork and clone the **bookshelf-mask** repository.
- Duplicate *test/knexfile.js.dist* and and update it to your needs.
- Make sure all the tests pass:

```sh
$ npm test
```

### Linting

**bookshelf-mask** enforces linting using [ESLint](http://eslint.org/) with the [Seegno-flavored ESLint config](https://github.com/seegno/eslint-config-seegno). We recommend you to install an **eslint** plugin in your editor of choice, although you can run the linter anytime with:

```sh
$ eslint src test
```

### Pull Request

Please follow these advices to simplify the pull request workflow:

- If you add or enhance functionality, an update of *README.md* usage section should be part of the PR.
- If your PR fixes a bug you should include tests that at least fail before your code changes and pass after.
- Keep your branch rebased and fix all conflicts before submitting.
- Make sure **Travis** build status is ok.

## License

[MIT](https://opensource.org/licenses/MIT)

[coveralls-image]: https://img.shields.io/coveralls/seegno/bookshelf-mask/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/seegno/bookshelf-mask?branch=master
[node-image]: https://img.shields.io/node/v/bookshelf-mask.svg?style=flat-square
[npm-image]: https://img.shields.io/npm/v/bookshelf-mask.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bookshelf-mask
[travis-image]: https://img.shields.io/travis/seegno/bookshelf-mask/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/seegno/bookshelf-mask
