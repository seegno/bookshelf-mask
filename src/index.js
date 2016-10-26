
/**
 * Module dependencies.
 */

import mask from 'json-mask';

/**
 * Export `bookshelf-mask` plugin.
 */

export default Bookshelf => {
  Bookshelf.Model = Bookshelf.Model.extend({
    mask(scope, options) {
      return mask(this.toJSON(options), this.constructor.masks && this.constructor.masks[scope] || scope);
    }
  });

  Bookshelf.Collection = Bookshelf.Collection.extend({
    mask(scope, options) {
      scope = this.model.masks && this.model.masks[scope] || scope;

      return this.toJSON(options).map(model => mask(model, scope));
    }
  });
};
