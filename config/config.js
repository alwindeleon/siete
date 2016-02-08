var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'siete'
    },
    port: 3000,
    db: 'mongodb://localhost/siete-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'siete'
    },
    port: 3000,
    db: 'mongodb://localhost/siete-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'siete'
    },
    port: 3000,
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/siete-production'
  }
};

module.exports = config[env];
