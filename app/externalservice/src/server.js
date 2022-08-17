const grpc = require('grpc');
const UpperCaseService = require('./interface');
const helloServiceImpl = require('./upperCaseService');
const DEFAULT_BIND = '0.0.0.0:9090';
const server = new grpc.Server();

server.addService(UpperCaseService.service, helloServiceImpl);

server.bind(DEFAULT_BIND, grpc.ServerCredentials.createInsecure());

console.log('gRPC server running at ' + DEFAULT_BIND);

server.start();