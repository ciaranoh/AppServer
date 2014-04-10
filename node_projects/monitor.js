// Low memory warning monitor
var Monitor = require('monitor');
var LOW_MEMORY_THRESHOLD = 100000000;

// Set the probe to push changes every 10 seconds
var options = {
  hostName: 'localhost',
  probeClass: 'Process',
  initParams: {
    pollInterval: 10000
  }
}
var processMonitor = new Monitor(options);

// Attach the change listener
processMonitor.on('change', function() {
  var freemem = processMonitor.get('freemem');
  console.log('Low memory warning: ' + freemem);
  if (freemem < LOW_MEMORY_THRESHOLD) {
    console.log('Low memory warning: ' + freemem);
  }
});

// Now connect the monitor
processMonitor.connect(function(error) {
  if (error) {
    console.error('Error connecting with the process probe: ', error);
    process.exit(1);
  }
});