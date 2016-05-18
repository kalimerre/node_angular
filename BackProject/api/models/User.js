/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: {
      type: 'string',
      unique: true
    },
    age: {
      type: 'integer',
    }
  },

  validationMessages: { //hand for i18n & l10n
    name: {
      unique: 'Ce nom est deja utilisee'
    }
  }
};

