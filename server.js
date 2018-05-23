const runServer   = require('./managedServer');
const simpleHandler = require('./simpleHandler');

runServer([{
    method: 'GET',
    path: '/{id}',
    handler: simpleHandler
}]);