var seeder = require('mongoose-seed'),
  config = require('./config/config');
 
// Connect to MongoDB via Mongoose 
seeder.connect(config.db, function() {
  
  // Load Mongoose models 
  seeder.loadModels([
    'app/models/user.js'
  ]);
 
  // Clear specified collections 
  seeder.clearModels(['User'], function() {
 
    // Callback to populate DB once collections have been cleared 
    seeder.populateModels(data);
 
  });
});
 
// Data array containing seed data - documents organized by Model 
var data = [
  { 
    'model': 'User',
    'documents': [
      {
        'username': 'enlister1',
        'password': '123',
        'role' : 'enlister'
      },
      {
        'username': 'adviser1',
        'password': '123',
        'role' : 'adviser'
      },
      {
        'username': 'regteam1',
        'password': '123',
        'role' : 'regteam'
      },
      {
        'username': 'system1',
        'password': '123',
        'role' : 'system'
      },
      {
        'username': 'regteamadmin1',
        'password': '123',
        'role' : 'regteamadmin'
      }
    ]
  }
];  
