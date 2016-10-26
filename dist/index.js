'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonMask = require('json-mask');

var _jsonMask2 = _interopRequireDefault(_jsonMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Export `bookshelf-mask` plugin.
 */

exports.default = Bookshelf => {
  Bookshelf.Model = Bookshelf.Model.extend({
    mask: function mask(scope, options) {
      return (0, _jsonMask2.default)(this.toJSON(options), this.constructor.masks && this.constructor.masks[scope] || scope);
    }
  });

  Bookshelf.Collection = Bookshelf.Collection.extend({
    mask: function mask(scope, options) {
      scope = this.model.masks && this.model.masks[scope] || scope;

      return this.toJSON(options).map(model => (0, _jsonMask2.default)(model, scope));
    }
  });
};
/**
 * Module dependencies.
 */

module.exports = exports['default'];