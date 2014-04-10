var util = require('util');

console.log('This process is pid ' + process.pid);
console.log(util.inspect(process.memoryUsage()));