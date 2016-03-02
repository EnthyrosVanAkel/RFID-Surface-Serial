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

	    console.log('Fallo al abrir: '+error);
	    socket.emit("refresh", { refresh: true});
	  } else {
	    console.log('ABIERTO');
	    serialPort.on('data', function(data) {
	      console.log('datos recibidos: ' + data);
	      socket.emit("rfid", {rfid : data});
	    });
	    serialPort.write("ls\n", function(err, results) {
	      console.log('error :' + err);
	      console.log('resultados :' + results);
	    });
	  }
	}); 

    
});
