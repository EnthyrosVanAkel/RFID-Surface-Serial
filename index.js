//Envía datos RFID a la aplicación Webkit a través de Socket.io

var io = require('socket.io').listen(1235);
var sp = require("serialport");
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("COM3", {
  baudrate: 9600,
  parser: sp.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true] 



io.sockets.on('connection', function (socket)
{	
	if(serialPort.isOpen())
	{
		serialPort.close();
	}
	
	serialPort.open(function (error) {
	  if ( error ) {

	    console.log('failed to open: '+error);
	    socket.emit("refresh", { refresh: true});
	  } else {
	    console.log('open');
	    serialPort.on('data', function(data) {
	      console.log('data received: ' + data);
	      socket.emit("rfid", {rfid : data});
	    });
	    serialPort.write("ls\n", function(err, results) {
	      console.log('err ' + err);
	      console.log('results ' + results);
	    });
	  }
	}); 

    
});
