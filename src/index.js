
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
      return mask(this.toJSON(options), this.masks && this.masks[scope] || scope);
    }
  });

  Bookshelf.Collection = Bookshelf.Collection.extend({
    mask(scope, options) {
      scope = this.model.prototype.masks && this.model.prototype.masks[scope] || scope;

      return this.toJSON(options).map(model => mask(model, scope));
    }
  });
};
