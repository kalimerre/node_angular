/**
 * Mp3.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      defaultsTo: "unknown"
    },
    album: {
      type: 'string',
      defaultsTo: "unknown"
    },
    artist: {
      type: 'string',
      defaultsTo: "unknown"
    },
    year: {
      type: 'integer',
      defaultsTo: "2016"
    },
    pathDatabase:
    {
      type:'string'
    }
  }

};

